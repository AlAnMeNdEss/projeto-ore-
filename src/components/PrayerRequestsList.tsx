import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Trash2, MessageCircle, Send, X, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [showAllComments, setShowAllComments] = useState(true);
  const { user } = useAuth();
  const cardRef = useRef(null);

  // Carregar mensagens do banco quando o card for renderizado
  const loadMessages = async () => {
    setLoadingMessages(true);
    try {
      console.log('🔄 Carregando mensagens para request:', request.id);
      
      // Carregar do Supabase
      const { data, error } = await supabase
        .from('prayer_messages')
        .select('id, message, created_at, user_id')
        .eq('prayer_request_id', request.id)
        .order('created_at', { ascending: true });

      if (!error && data) {
        console.log('✅ Mensagens carregadas:', data.length);
        setMessages(data);
        // Salvar no localStorage como backup
        localStorage.setItem(`messages_${request.id}`, JSON.stringify(data));
      } else {
        console.log('❌ Erro no Supabase:', error);
        
        // Fallback para localStorage
        const localMessages = localStorage.getItem(`messages_${request.id}`);
        if (localMessages) {
          try {
            const parsed = JSON.parse(localMessages);
            console.log('📱 Usando mensagens do localStorage:', parsed.length);
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
      console.log('📤 Enviando mensagem...');
      
      // Salvar no Supabase
      const { data, error } = await supabase
        .from('prayer_messages')
        .insert({
          prayer_request_id: request.id,
          user_id: user.id,
          message: message.trim()
        })
        .select();

      if (!error && data && data[0]) {
        console.log('✅ Mensagem enviada com sucesso');
        
        // Adicionar a mensagem imediatamente ao estado local
        const newMessage = {
          id: data[0].id,
          message: data[0].message,
          created_at: data[0].created_at,
          user_id: data[0].user_id,
          profiles: { name: user.user_metadata?.name || 'Você' }
        };
        
        setMessages(prev => [...prev, newMessage]);
        setMessage('');
        setLastMessageSent(message.trim());
        
        // Salvar no localStorage como backup
        const currentMessages = [...messages, newMessage];
        localStorage.setItem(`messages_${request.id}`, JSON.stringify(currentMessages));
        
        // Recarregar mensagens do banco após 1 segundo
        setTimeout(() => {
          loadMessages();
        }, 1000);
      } else {
        console.log('❌ Erro no Supabase:', error);
        // Só salva localmente se estiver offline
        if (navigator.onLine === false) {
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
          alert('Você está offline. O comentário foi salvo apenas neste dispositivo.');
        } else {
          alert('Erro ao enviar comentário. Tente novamente.');
        }
      }
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error);
      if (navigator.onLine === false) {
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
        alert('Você está offline. O comentário foi salvo apenas neste dispositivo.');
      } else {
        alert('Erro ao enviar comentário. Tente novamente.');
      }
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

  const handleDeleteMessage = async (messageId: string) => {
    try {
      console.log('🗑️ Apagando mensagem:', messageId);
      
      const { error } = await supabase
        .from('prayer_messages')
        .delete()
        .eq('id', messageId)
        .eq('user_id', user?.id);

      if (!error) {
        console.log('✅ Mensagem apagada com sucesso');
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
        
        // Atualizar localStorage
        const updatedMessages = messages.filter(msg => msg.id !== messageId);
        localStorage.setItem(`messages_${request.id}`, JSON.stringify(updatedMessages));
      } else {
        console.log('❌ Erro ao apagar mensagem:', error);
        alert('Erro ao apagar comentário. Tente novamente.');
      }
    } catch (error) {
      console.error('💥 Erro ao apagar mensagem:', error);
      alert('Erro ao apagar comentário. Tente novamente.');
    }
  };

  // 1. Altere a lógica de commentsToShow:
  // const commentsToShow = showAllComments ? [] : messages.slice(-3);
  // 2. No botão de expandir, troque o texto/ícone para:
  // {showAllComments ? 'Esconder comentários' : 'Mostrar comentários'}
  // 3. O botão deve alternar entre mostrar 3 comentários e esconder todos (nenhum visível).
  // 4. Não mostrar nenhum comentário quando expandido.
  const commentsToShow = showAllComments ? [] : messages.slice(-3);

  return (
    <Card ref={cardRef} className="w-full max-w-sm mx-auto mb-4 p-4 flex flex-col gap-3 bg-white rounded-2xl shadow-md">
      <div style={{zIndex: 1, position: 'relative'}}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-[#23232b]">{displayName}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className={`flex items-center gap-1 px-3 py-1.5 text-base font-bold rounded-md shadow-sm border-2 transition-all duration-150
    ${orou ? 'bg-green-500 text-white border-green-600 cursor-not-allowed shadow' : 'bg-[#a084e8] text-white border-[#a084e8] hover:bg-[#7c3aed] hover:shadow-lg'}`}
              onClick={() => onPray(request.id)}
              disabled={orou}
              aria-label="Orar por este pedido"
            >
              <span className={`text-xl ${orou ? 'text-white' : 'text-white'}`}>🙏</span>
              {orou ? 'Orado' : 'Orar'}
            </button>
            <span className="ml-2 px-2 py-0.5 rounded-md bg-white border-2 border-[#a084e8] text-[#a084e8] font-bold text-sm shadow">{request.prayer_count || 0}</span>
            {canDelete && (
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-[#e5e7eb] bg-[#e5e7eb] text-red-500 text-base shadow-sm hover:bg-[#d1d5db] transition-colors duration-150 p-0"
                onClick={() => onDelete(request.id)}
                title="Apagar pedido"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        <div className="text-xl text-[#23232b] font-medium mb-4 break-words whitespace-pre-wrap leading-relaxed">{request.text}</div>
        
        {/* Seção de Comentários */}
        {loadingMessages && (
          <div className="mb-4">
            <div className="border-t border-gray-200 pt-3">
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#a084e8]"></div>
                <span className="ml-2 text-sm text-gray-500">Carregando comentários...</span>
              </div>
            </div>
          </div>
        )}
        
        {!loadingMessages && messages.length > 0 && (
          <div className="flex items-center justify-between mt-4 mb-2">
            <div className="flex-1 text-lg font-bold text-[#673AB7] text-center">Palavras de apoio e fé</div>
            <button
              onClick={() => setShowAllComments(v => !v)}
              className="rounded-full bg-white shadow p-2 border border-gray-200 hover:bg-gray-50 transition-transform"
              aria-label={showAllComments ? 'Esconder comentários' : 'Mostrar comentários'}
            >
              {showAllComments ? <ChevronUp className="w-5 h-5 text-[#a084e8] transition-transform" /> : <ChevronDown className="w-5 h-5 text-[#a084e8] transition-transform" />}
            </button>
          </div>
        )}
        
        {!loadingMessages && commentsToShow.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-3 border border-gray-100">
            <div className="space-y-4">
              {commentsToShow.map((msg) => (
                <div key={msg.id} className="bg-[#f7f7fa] rounded-xl p-3 flex gap-3 items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#a084e8] rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {getMessageAuthorName(msg).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#23232b]">
                        {getMessageAuthorName(msg)}
                      </span>
                      {msg.user_id === user?.id && (
                        <span className="text-xs text-blue-500 font-medium">você</span>
                      )}
                      {lastMessageSent === msg.message && (
                        <span className="text-xs text-green-500 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          enviado
                        </span>
                      )}
                    </div>
                    <div className="text-base text-[#23232b] font-medium mt-2 mb-2 leading-relaxed break-words">{msg.message}</div>
                    <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                      <span>
                        {new Date(msg.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {msg.user_id === user?.id && (
                        <button 
                          className="text-red-500 hover:text-red-700 ml-1 p-1 rounded transition"
                          onClick={() => {
                            if (confirm('Deseja apagar este comentário?')) {
                              handleDeleteMessage(msg.id);
                            }
                          }}
                          title="Apagar comentário"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Campo de adicionar comentário */}
            <div className="flex gap-2 items-center mt-4 border-t border-gray-200 pt-3 bg-white rounded-xl px-2 shadow-sm">
              <div className="flex-shrink-0 w-6 h-6 bg-[#a084e8] rounded-full flex items-center justify-center text-white text-xs font-bold">
                {user?.user_metadata?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Adicione um comentário..."
                className="flex-1 px-3 py-2 border-2 border-[#a084e8] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#a084e8] text-sm"
                disabled={sendingMessage}
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || sendingMessage}
                className="px-4 py-2 bg-[#a084e8] text-white font-bold rounded-lg shadow hover:bg-[#7c3aed] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                {sendingMessage ? (
                  <div className="w-4 h-4 border-2 border-[#a084e8] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-3 h-3" />
                    Enviar
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        
        {!loadingMessages && messages.length === 0 && (
          <div className="mb-4">
            <div className="border-t border-gray-200 pt-3">
              <div className="text-center py-4">
                <span className="text-sm text-gray-500 text-center">Se quiser, deixe uma palavra de apoio, fé ou encorajamento.</span>
              </div>
            </div>
            {/* Campo de adicionar comentário */}
            <div className="flex gap-2 items-center mt-4 border-t border-gray-200 pt-3 bg-white rounded-xl px-2 shadow-sm">
              <div className="flex-shrink-0 w-6 h-6 bg-[#a084e8] rounded-full flex items-center justify-center text-white text-xs font-bold">
                {user?.user_metadata?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Adicione um comentário..."
                className="flex-1 px-3 py-2 border-2 border-[#a084e8] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#a084e8] text-sm"
                disabled={sendingMessage}
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || sendingMessage}
                className="px-4 py-2 bg-[#a084e8] text-white font-bold rounded-lg shadow hover:bg-[#7c3aed] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                {sendingMessage ? (
                  <div className="w-4 h-4 border-2 border-[#a084e8] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-3 h-3" />
                    Enviar
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        
      </div>
    </Card>
  );
}

export default function PrayerRequestsList({ refreshRequests }: { refreshRequests?: () => void }) {
  const { requests, loading, prayForRequest, deleteRequest, prayedRequestsIds } = usePrayerRequests();
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
            orou={prayedRequestsIds.includes(request.id)}
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