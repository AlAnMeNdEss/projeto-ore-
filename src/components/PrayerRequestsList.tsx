import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePrayerRequests } from '@/hooks/usePrayerRequests';
import { useAuth } from '@/hooks/useAuth';
import { PRAYER_CATEGORIES, PrayerCategory } from '@/types/prayer';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Heart, Trash2, Filter } from 'lucide-react';
import React from 'react';
import { useSwipeable } from 'react-swipeable';

function PrayerRequestCard({ request, orou, onPray, canDelete, onDelete, displayName }) {
  const [offsetX, setOffsetX] = React.useState(0);
  const [isSwiping, setIsSwiping] = React.useState(false);
  const [showDelete, setShowDelete] = React.useState(false);
  const handlers = useSwipeable({
    onSwiping: (event) => {
      setIsSwiping(true);
      setOffsetX(event.deltaX);
      if (canDelete && event.deltaX < -120) {
        setShowDelete(true);
      } else {
        setShowDelete(false);
      }
    },
    onSwipedLeft: () => {
      if (canDelete && offsetX < -120) {
        onDelete(request.id);
      }
      setIsSwiping(false);
      setOffsetX(0);
      setShowDelete(false);
    },
    onSwiped: () => {
      setIsSwiping(false);
      setOffsetX(0);
      setShowDelete(false);
    },
    trackMouse: true,
  });
  const style = {
    transform: `translateX(${offsetX}px)`,
    transition: isSwiping ? 'none' : 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
  };
  return (
    <div className="relative">
      {canDelete && (
        <div className={`absolute inset-0 flex items-center justify-end pr-8 rounded-2xl transition-colors duration-200 ${showDelete ? 'bg-red-100' : 'bg-transparent'}`}
             style={{zIndex: 0}}>
          <Trash2 className={`w-8 h-8 ${showDelete ? 'text-red-500' : 'text-red-300'} transition-colors`} />
        </div>
      )}
      <div
        {...handlers}
        style={{...style, zIndex: 1, position: 'relative'}}
        className="rounded-2xl bg-white shadow-lg p-4 w-full max-w-full flex flex-col gap-3 border border-[#f3e8ff]"
      >
        <div className="text-base font-bold text-[#23232b] mb-1">
          {displayName}
        </div>
        <div className="text-lg text-[#23232b] font-medium mb-2 break-words whitespace-pre-wrap">{request.text}</div>
        <div className="border-b border-[#ede9fe] my-1"></div>
        <div className="flex items-center gap-2 mt-1">
          <button
            className={`flex items-center justify-center w-10 h-10 rounded-xl border-2 ${orou ? 'border-pink-400 bg-pink-50' : 'border-[#a084e8] bg-white'} text-xl mr-2 transition-colors`}
            onClick={() => onPray(request.id)}
            disabled={orou}
          >
            <svg xmlns='http://www.w3.org/2000/svg' fill={orou ? '#ef476f' : 'none'} viewBox='0 0 24 24' stroke='currentColor' className='w-5 h-5'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z' />
            </svg>
          </button>
          <button className="flex items-center justify-center w-10 h-10 rounded-xl border-2 border-[#ede9fe] bg-white text-[#23232b] text-xl mr-2">
            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' className='w-5 h-5'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 8h10M7 12h4m1 8a9 9 0 100-18 9 9 0 000 18z' /></svg>
          </button>
          <div className="flex-1 flex items-center justify-end gap-2 text-[#23232b] text-base">
            <span className="text-2xl mr-1">🙏</span>
            <span className="font-bold">{request.prayer_count || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PrayerRequestsList({ refreshRequests }: { refreshRequests?: () => void }) {
  const { requests, loading, prayForRequest, deleteRequest } = usePrayerRequests();
  const { user } = useAuth();
  // Chave personalizada para cada usuário
  const orouKey = user ? `orouIds_${user.id}` : 'orouIds_guest';
  const [orouIds, setOrouIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(orouKey);
    return saved ? JSON.parse(saved) : [];
  });

  // Atualiza a lista se o usuário mudar
  React.useEffect(() => {
    const saved = localStorage.getItem(orouKey);
    setOrouIds(saved ? JSON.parse(saved) : []);
    // eslint-disable-next-line
  }, [user && user.id]);

  // Sempre salva no localStorage quando orouIds muda
  React.useEffect(() => {
    localStorage.setItem(orouKey, JSON.stringify(orouIds));
    // eslint-disable-next-line
  }, [orouIds, orouKey]);

  // Função para obter o nome a ser exibido no card
  function getDisplayName(request) {
    if (user && request.user_id === user.id) {
      // Se for o próprio pedido, mostrar o nome do profile se houver, senão 'Você'
      if (user.user_metadata && user.user_metadata.name && user.user_metadata.name.trim() !== '') {
        return user.user_metadata.name;
      }
      return 'Você';
    }
    return request.name && request.name.trim() !== '' ? request.name : 'Anônimo';
  }

  const filteredRequests = requests; // Sem filtro de categoria

  const handlePray = async (requestId: string) => {
    if (!user) return;
    await prayForRequest(requestId, user.id);
    setOrouIds((prev) => {
      if (prev.includes(requestId)) return prev;
      return [...prev, requestId];
    });
    if (refreshRequests) refreshRequests();
  };

  const handleDelete = async (requestId: string) => {
    if (!user) return;
    await deleteRequest(requestId);
    if (refreshRequests) refreshRequests();
  };

  const canDelete = (request: any) => {
    return user && request.user_id === user.id;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse rounded-2xl border border-white/20 bg-white/5 p-4 shadow-none">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-20 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredRequests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="bg-white/10 rounded-2xl p-8 flex flex-col items-center gap-4 shadow-none border border-white/10">
          <Heart className="h-10 w-10 text-[#8b5cf6] mb-2 animate-pulse" />
          <p className="text-lg text-[#8b5cf6] font-semibold">Nenhum pedido de oração ainda</p>
          <p className="text-sm text-gray-300">Seja o primeiro a compartilhar um pedido!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-1 space-y-4">
      <div className="space-y-6">
        {filteredRequests.map(request => (
          <PrayerRequestCard
            key={request.id}
            request={request}
            orou={orouIds.includes(request.id)}
            onPray={handlePray}
            canDelete={canDelete(request)}
            onDelete={handleDelete}
            displayName={getDisplayName(request)}
          />
        ))}
      </div>
    </div>
  );
}