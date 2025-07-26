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
      
      // Primeiro, tentar carregar do localStorage para mostrar algo rapidamente
      const localMessages = localStorage.getItem(`messages_${request.id}`);
      if (localMessages) {
        try {
          const parsed = JSON.parse(localMessages);
          console.log('📱 Mensagens do localStorage:', parsed);
          setMessages(parsed);
        } catch (e) {
          console.log('❌ Erro ao parsear localStorage:', e);
        }
      }
      
      // Tentar carregar do Supabase
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
          alert('❌ Tabela prayer_messages não existe! Execute o SQL no Supabase Dashboard.');
        }
        
        // Manter mensagens do localStorage se Supabase falhar
        if (!localMessages) {
          setMessages([]);
        }
      }
    } catch (error) {
      console.error('💥 Erro geral ao carregar mensagens:', error);
      // Manter mensagens do localStorage se tudo falhar
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
    
    // Atualizar mensagens a cada 5 segundos
    const interval = setInterval(() => {
      console.log('⏰ Polling para request:', request.id);
      loadMessages();
    }, 5000);
    
    // Recarregar quando a janela ganha foco
    const handleFocus = () => {
      console.log('👁️ Janela focada, recarregando mensagens para request:', request.id);
      loadMessages();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      console.log('🧹 Limpando intervalo e listener para request:', request.id);
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
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
        
        {/* Seção de Mensagens */}
        {messages.length > 0 && (
          <div className="mb-4">
            <div className="border-t border-gray-200 pt-3">
              <h4 className="text-sm font-semibold text-gray-600 mb-2">Comentários:</h4>
              <div className="space-y-2">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-2">
                    <div className="flex-shrink-0 w-2 h-2 bg-[#a084e8] rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#23232b]">
                        {getMessageAuthorName(msg)}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {msg.message}
                        {lastMessageSent === msg.message && (
                          <span className="ml-2 text-xs text-green-500">✓ Enviado</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Input inline para enviar mensagem */}
        <div className="border-t border-gray-200 pt-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escreva um comentário..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a084e8] focus:border-transparent text-sm"
              disabled={sendingMessage}
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || sendingMessage}
              className="px-4 py-2 bg-[#a084e8] text-white rounded-lg hover:bg-[#8b5cf6] transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {sendingMessage ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Enviar'
              )}
            </button>
          </div>
          
          {/* Botões de debug */}
          <div className="mt-2 flex gap-2">
            <button
              onClick={async () => {
                console.log('=== TESTE DE CONEXÃO ===');
                console.log('User:', user);
                console.log('Request ID:', request.id);
                
                // Testar se consegue inserir uma mensagem de teste
                try {
                  const { data, error } = await supabase
                    .from('prayer_messages' as any)
                    .insert({
                      prayer_request_id: request.id,
                      user_id: user?.id,
                      message: 'TESTE DE CONEXÃO - ' + new Date().toISOString()
                    })
                    .select();
                  
                  console.log('Teste de inserção:', { data, error });
                  
                  if (!error) {
                    alert('✅ Conexão com Supabase funcionando!');
                    await loadMessages();
                  } else {
                    alert('❌ Erro na conexão: ' + error.message);
                  }
                } catch (err) {
                  console.error('Erro no teste:', err);
                  alert('❌ Erro no teste: ' + err.message);
                }
              }}
              className="px-3 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
            >
              Testar Conexão
            </button>
            
            <button
              onClick={() => {
                console.log('=== LIMPANDO MENSAGENS ===');
                localStorage.removeItem(`messages_${request.id}`);
                setMessages([]);
                setLastMessageSent('');
                alert('🧹 Mensagens limpas!');
              }}
              className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
            >
              Limpar Mensagens
            </button>
            
            <button
              onClick={() => {
                console.log('=== STATUS ATUAL ===');
                console.log('Mensagens no estado:', messages);
                console.log('localStorage:', localStorage.getItem(`messages_${request.id}`));
                console.log('Usuário:', user);
                alert(`📊 Status: ${messages.length} mensagens no estado, ${localStorage.getItem(`messages_${request.id}`) ? 'com localStorage' : 'sem localStorage'}`);
              }}
              className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
            >
              Status
            </button>
            
            <button
              onClick={async () => {
                console.log('=== FORÇANDO RECARREGAMENTO ===');
                await loadMessages();
                alert('🔄 Mensagens recarregadas!');
              }}
              className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
            >
              Recarregar
            </button>
            
            <button
              onClick={async () => {
                console.log('=== TESTANDO SE TABELA EXISTE ===');
                try {
                  // Tentar fazer uma consulta simples para ver se a tabela existe
                  const { data, error } = await supabase
                    .from('prayer_messages' as any)
                    .select('id')
                    .limit(1);
                  
                  if (error) {
                    console.log('❌ Erro ao acessar tabela:', error);
                    if (error.message.includes('relation "prayer_messages" does not exist')) {
                      alert('❌ Tabela prayer_messages NÃO EXISTE!\n\nExecute o SQL no Supabase Dashboard:\n\n1. Vá para https://supabase.com/dashboard\n2. Selecione seu projeto\n3. Vá para SQL Editor\n4. Cole o conteúdo do arquivo create_prayer_messages_table_manual.sql\n5. Execute o SQL');
                    } else {
                      alert('❌ Erro ao acessar tabela: ' + error.message);
                    }
                  } else {
                    console.log('✅ Tabela existe! Dados:', data);
                    alert('✅ Tabela prayer_messages existe e está funcionando!');
                  }
                } catch (err) {
                  console.error('💥 Erro no teste:', err);
                  alert('💥 Erro no teste: ' + err.message);
                }
              }}
              className="px-3 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600"
            >
              Testar Tabela
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