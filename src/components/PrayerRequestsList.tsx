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
  const { user } = useAuth();
  const cardRef = useRef(null);

  // Carregar mensagens do banco quando o card for renderizado
  const loadMessages = async () => {
    setLoadingMessages(true);
    try {
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

      if (!error && data) {
        setMessages(data);
      } else {
        console.error('Erro ao carregar mensagens:', error);
        setMessages([]);
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
      setMessages([]);
    }
    setLoadingMessages(false);
  };

  useEffect(() => {
    loadMessages();
  }, [request.id]);

  const handleSendMessage = async () => {
    if (!user || !message.trim()) return;

    setSendingMessage(true);
    try {
      const { error } = await supabase
        .from('prayer_messages' as any)
        .insert({
          prayer_request_id: request.id,
          user_id: user.id,
          message: message.trim()
        });

      if (!error) {
        setMessage('');
        await loadMessages(); // Recarregar mensagens
      } else {
        console.error('Erro ao enviar mensagem:', error);
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
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