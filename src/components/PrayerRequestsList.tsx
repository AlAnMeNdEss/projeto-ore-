import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Trash2, MessageCircle, Send, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePrayerRequests } from '@/hooks/usePrayerRequests';
import { supabase } from '../integrations/supabase/client';

function PrayerRequestCard({ request, orou, onPray, canDelete, onDelete, displayName, onOpenMessage }: {
  request: any;
  orou: boolean;
  onPray: (id: string) => void;
  canDelete: boolean;
  onDelete: (id: string) => void;
  displayName: string;
  onOpenMessage: () => void;
}) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [lastMessageSent, setLastMessageSent] = useState<string>('');
  const { user } = useAuth();
  const cardRef = useRef(null);

  // Carregar mensagens do banco quando o card for renderizado
  const loadMessages = async () => {
    setLoadingMessages(true);
    try {
      console.log('🔄 Carregando mensagens para request:', request.id);
      console.log('👤 Usuário atual:', user?.id);
      
      // Tentar carregar do Supabase primeiro
      console.log('🌐 Tentando carregar do Supabase...');
      const { data, error } = await supabase
        .from('prayer_messages' as any)
        .select(`
          id,
          message,
          created_at,
          user_id,
          profiles:user_id(name, email)
        `)
        .eq('prayer_request_id', request.id)
        .order('created_at', { ascending: true });

      console.log('📡 Resposta do Supabase:', { data, error });

      if (!error && data) {
        console.log('✅ Mensagens carregadas do Supabase:', data);
        setMessages(data);
        // Salvar no localStorage como backup
        localStorage.setItem(`messages_${request.id}`, JSON.stringify(data));
      } else {
        console.log('❌ Erro no Supabase:', error);
        console.log('🔍 Detalhes do erro:', {
          message: error?.message,
          details: error?.details,
          hint: error?.hint,
          code: error?.code
        });
        
        // Se for erro de tabela não encontrada, mostrar instruções
        if (error?.message?.includes('relation "prayer_messages" does not exist')) {
          console.log('❌ TABELA NÃO EXISTE! Execute o SQL no Supabase Dashboard.');
          alert('❌ Tabela prayer_messages não existe!\n\nExecute o SQL no Supabase Dashboard:\n\n1. Vá para https://supabase.com/dashboard\n2. Selecione seu projeto\n3. Vá para SQL Editor\n4. Cole o conteúdo do arquivo create_prayer_messages_table_manual.sql\n5. Execute o SQL');
        }
        
        // Fallback para localStorage
        const localMessages = localStorage.getItem(`messages_${request.id}`);
        if (localMessages) {
          try {
            const parsed = JSON.parse(localMessages);
            console.log('📱 Usando mensagens do localStorage:', parsed);
            setMessages(parsed);
          } catch (e) {
            console.log('❌ Erro ao parsear localStorage:', e);
            setMessages([]);
          }
        } else {
          setMessages([]);
        }
      }
    } catch (error) {
      console.error('💥 Erro geral ao carregar mensagens:', error);
      // Fallback para localStorage
      const localMessages = localStorage.getItem(`messages_${request.id}`);
      if (localMessages) {
        try {
          setMessages(JSON.parse(localMessages));
        } catch (e) {
          setMessages([]);
        }
      } else {
        setMessages([]);
      }
    }
    setLoadingMessages(false);
  };

  useEffect(() => {
    console.log('🔄 useEffect disparado para request:', request.id);
    loadMessages();
    
    // Configurar Supabase Realtime para mensagens
    const channel = supabase
      .channel(`prayer_messages_${request.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'prayer_messages',
          filter: `prayer_request_id=eq.${request.id}`
        },
        (payload) => {
          console.log('📡 Realtime update:', payload);
          
          if (payload.eventType === 'INSERT') {
            // Nova mensagem inserida
            const newMessage = {
              ...payload.new,
              profiles: { name: 'Novo usuário' } // Será atualizado no próximo loadMessages
            };
            setMessages(prev => [...prev, newMessage]);
            console.log('✅ Nova mensagem adicionada via Realtime');
          } else if (payload.eventType === 'DELETE') {
            // Mensagem deletada
            setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
            console.log('🗑️ Mensagem removida via Realtime');
          }
        }
      )
      .subscribe();
    
    return () => {
      console.log('🧹 Limpando subscription para request:', request.id);
      supabase.removeChannel(channel);
    };
  }, [request.id]);

    const handleSendMessage = async () => {
    if (!user || !message.trim()) return;

    setSendingMessage(true);
    try {
      console.log('=== ENVIANDO MENSAGEM ===');
      console.log('Request ID:', request.id);
      console.log('User ID:', user.id);
      console.log('User Name:', user.user_metadata?.name);
      console.log('Message:', message.trim());
      
      // Tentar salvar no Supabase primeiro
      const { data, error } = await supabase
        .from('prayer_messages' as any)
        .insert({
          prayer_request_id: request.id,
          user_id: user.id,
          message: message.trim()
        })
        .select();

      console.log('Resposta do Supabase ao enviar:', { data, error });

      if (!error) {
        console.log('✅ Mensagem enviada com sucesso para o Supabase');
        console.log('Dados retornados:', data);
        setMessage('');
        
        // Adicionar a mensagem imediatamente ao estado local
        if (data && data[0]) {
          const newMessage = {
            id: (data[0] as any).id,
            message: (data[0] as any).message,
            created_at: (data[0] as any).created_at,
            user_id: (data[0] as any).user_id,
            profiles: { name: user.user_metadata?.name || 'Você' }
          };
          setMessages(prev => [...prev, newMessage]);
          setLastMessageSent(message.trim());
          
          // Salvar no localStorage imediatamente
          const currentMessages = [...messages, newMessage];
          localStorage.setItem(`messages_${request.id}`, JSON.stringify(currentMessages));
        }
        
        // Recarregar mensagens do banco após 2 segundos
        setTimeout(() => {
          console.log('🔄 Recarregando mensagens após envio...');
          loadMessages();
        }, 2000);
      } else {
        console.log('❌ Erro no Supabase, usando localStorage:', error);
        // Fallback para localStorage se Supabase falhar
        const newMessage = {
          id: Date.now().toString(),
          message: message.trim(),
          user_id: user.id,
          created_at: new Date().toISOString(),
          profiles: { name: user.user_metadata?.name || 'Você' }
        };
        
        const currentMessages = [...messages, newMessage];
        setMessages(currentMessages);
        localStorage.setItem(`messages_${request.id}`, JSON.stringify(currentMessages));
        setMessage('');
        console.log('💾 Mensagem salva no localStorage');
      }
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error);
      // Fallback para localStorage
      const newMessage = {
        id: Date.now().toString(),
        message: message.trim(),
        user_id: user.id,
        created_at: new Date().toISOString(),
        profiles: { name: user.user_metadata?.name || 'Você' }
      };
      
      const currentMessages = [...messages, newMessage];
      setMessages(currentMessages);
      localStorage.setItem(`messages_${request.id}`, JSON.stringify(currentMessages));
      setMessage('');
      console.log('💾 Mensagem salva no localStorage (fallback)');
    }
    setSendingMessage(false);
  };

  const getMessageAuthorName = (message: any) => {
    if (message.user_id === user?.id) {
      return user.user_metadata?.name || 'Você';
    }
    return message.profiles?.name || 'Anônimo';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card ref={cardRef} className="relative rounded-3xl bg-white/60 backdrop-blur-md shadow-md w-full max-w-md mx-auto mb-4 p-6 flex flex-col gap-4 border border-white/30">
      <div style={{zIndex: 1, position: 'relative'}}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-[#23232b]">{displayName}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className={`w-11 h-11 flex items-center justify-center rounded-full border-2 ${orou ? 'border-pink-400 bg-pink-50' : 'border-[#a084e8] bg-[#f3f4f6]'} text-xl shadow-sm hover:scale-105 transition-transform duration-150`}
              onClick={() => onPray(request.id)}
              disabled={orou}
              style={{ background: '#f3f4f6' }}
            >
              <svg xmlns='http://www.w3.org/2000/svg' fill={orou ? '#ef476f' : 'none'} viewBox='0 0 24 24' stroke='currentColor' className='w-6 h-6'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z' />
              </svg>
            </button>
            {canDelete && (
              <button
                className="w-11 h-11 flex items-center justify-center rounded-full border-2 border-[#e5e7eb] bg-[#e5e7eb] text-red-500 text-xl shadow-sm hover:bg-[#d1d5db] transition-colors duration-150"
                onClick={() => onDelete(request.id)}
                title="Apagar pedido"
              >
                <Trash2 className="w-6 h-6" />
              </button>
            )}
            <span className="text-2xl">🙏</span>
            <span className="font-bold text-lg bg-white rounded-full px-3 py-1 shadow border border-[#e5e7eb]">{request.prayer_count || 0}</span>
          </div>
        </div>
        
        <div className="text-xl text-[#23232b] font-medium mb-4 break-words whitespace-pre-wrap leading-relaxed">{request.text}</div>
        
        {/* Seção de Mensagens - Estilo Instagram */}
        {messages.length > 0 && (
          <div className="mb-4">
            <div className="border-t border-gray-200 pt-3">
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-[#a084e8] rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {getMessageAuthorName(msg).charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#23232b]">
                          {getMessageAuthorName(msg)}
                        </span>
                        {lastMessageSent === msg.message && (
                          <span className="text-xs text-green-500">✓</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-700 mt-1 leading-relaxed">
                        {msg.message}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(msg.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Input inline para enviar mensagem - Estilo Instagram */}
        <div className="border-t border-gray-200 pt-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Adicione um comentário..."
              className="flex-1 px-3 py-2 border-0 focus:outline-none text-sm bg-transparent"
              disabled={sendingMessage}
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || sendingMessage}
              className="px-3 py-1 text-[#a084e8] font-semibold text-sm hover:text-[#8b5cf6] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sendingMessage ? (
                <div className="w-4 h-4 border-2 border-[#a084e8] border-t-transparent rounded-full animate-spin" />
              ) : (
                'Enviar'
              )}
            </button>
          </div>
          
          {/* Botão de debug temporário */}
          <div className="mt-2">
            <button
              onClick={async () => {
                console.log('=== DEBUG: TESTANDO TABELA ===');
                try {
                  const { data, error } = await supabase
                    .from('prayer_messages' as any)
                    .select('id')
                    .limit(1);
                  
                  if (error) {
                    console.log('❌ Erro:', error);
                    alert('❌ Erro: ' + error.message);
                  } else {
                    console.log('✅ Tabela existe! Dados:', data);
                    alert('✅ Tabela existe! Agora teste enviar uma mensagem.');
                  }
                } catch (err) {
                  console.error('💥 Erro:', err);
                  alert('💥 Erro: ' + err.message);
                }
              }}
              className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
            >
              Debug: Testar Tabela
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function PrayerRequestsList({ refreshRequests }: { refreshRequests?: () => void }) {
  const { requests, loading, prayForRequest, deleteRequest } = usePrayerRequests();
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a084e8]"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {requests.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum pedido de oração ainda.</p>
        </div>
      ) : (
        requests.map((request) => (
          <PrayerRequestCard
            key={request.id}
            request={request}
            orou={request.user_id === user?.id}
            onPray={() => prayForRequest(request.id, user?.id)}
            canDelete={request.user_id === user?.id}
            onDelete={() => deleteRequest(request.id)}
            displayName={request.name || 'Anônimo'}
            onOpenMessage={() => {}}
          />
        ))
      )}
    </div>
  );
}