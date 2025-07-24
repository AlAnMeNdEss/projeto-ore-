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

export function PrayerRequestsList({ refreshRequests }: { refreshRequests?: () => void }) {
  const { requests, loading, prayForRequest, deleteRequest } = usePrayerRequests();
  const { user } = useAuth();
  const [orouIds, setOrouIds] = useState<string[]>([]);

  const filteredRequests = requests; // Sem filtro de categoria

  const handlePray = async (requestId: string) => {
    if (!user) return;
    await prayForRequest(requestId, user.id);
    setOrouIds((prev) => [...prev, requestId]);
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
          <div key={request.id} className="relative rounded-2xl bg-white shadow-lg p-4 w-full max-w-full flex flex-col gap-3 border border-[#f3e8ff]">
            <div className="text-base font-bold text-[#23232b] mb-1">Utilizador</div>
            <div className="text-lg text-[#23232b] font-medium mb-2 break-words whitespace-pre-wrap">{request.text}</div>
            <div className="border-b border-[#ede9fe] my-1"></div>
            <div className="flex items-center gap-2 mt-1">
              <button
                className={`flex items-center justify-center w-10 h-10 rounded-xl border-2 ${orouIds.includes(request.id) ? 'border-pink-400 bg-pink-50' : 'border-[#a084e8] bg-white'} text-xl mr-2 transition-colors`}
                onClick={() => handlePray(request.id)}
                disabled={orouIds.includes(request.id)}
              >
                <svg xmlns='http://www.w3.org/2000/svg' fill={orouIds.includes(request.id) ? '#ef476f' : 'none'} viewBox='0 0 24 24' stroke='currentColor' className='w-5 h-5'>
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
        ))}
      </div>
    </div>
  );
}