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
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [orouIds, setOrouIds] = useState<string[]>([]);

  const filteredRequests = requests.filter(request => {
    if (filterCategory === 'all') return true;
    return request.category === filterCategory;
  });

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

  // Ícones para cada categoria
  const CATEGORY_ICONS: Record<string, string> = {
    financeiro: '💰',
    familia: '👨‍👩‍👧‍👦',
    saude: '❤️',
    trabalho: '💼',
    espiritual: '🙏',
    outros: '✨',
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
    <div className="space-y-6 sm:space-y-8">
      <div className="flex items-center gap-2 sm:gap-4 mb-2">
        <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full sm:w-[200px] text-sm">
            <SelectValue placeholder="Filtrar por categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {Object.entries(PRAYER_CATEGORIES).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-6">
        {filteredRequests.map(request => (
          <Card key={request.id} className="relative rounded-2xl border border-white/15 bg-white/10 p-0 shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-[#a78bfa] via-[#f3e8ff] to-[#6d28d9] text-white text-2xl shadow">
                  {CATEGORY_ICONS[request.category] || '✨'}
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#8b5cf6]/10 text-[#8b5cf6] border border-[#8b5cf6]/20">
                  {PRAYER_CATEGORIES[request.category] || 'Categoria desconhecida'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1 whitespace-pre-wrap leading-snug">{request.text}</h3>
              <div className="flex items-center justify-between mt-2 mb-1 text-xs text-gray-300">
                <span>
                  {request.name ? <span>Por: <span className="font-semibold text-[#b2a4ff]">{request.name}</span></span> : <span>Anônimo</span>}
                </span>
                <span>
                  {formatDistanceToNow(new Date(request.created_at), { addSuffix: true, locale: ptBR })}
                  <span className="mx-1">•</span>
                  {format(new Date(request.created_at), 'dd/MM/yyyy')}
                </span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#b2a4ff] font-semibold">
                  <Heart className="h-4 w-4 text-pink-400" />
                  <span>
                    {request.prayer_count} {request.prayer_count === 1 ? 'oração' : 'orações'}
                  </span>
                </div>
                <div className="flex gap-2">
                  {user && (
                    <Button
                      onClick={() => handlePray(request.id)}
                      variant={orouIds.includes(request.id) ? 'default' : 'outline'}
                      size="sm"
                      className={orouIds.includes(request.id)
                        ? 'bg-[#8b5cf6] text-white border-[#8b5cf6] cursor-default rounded-full px-4 py-1 text-xs sm:text-sm font-semibold shadow-sm'
                        : 'border-[#b2a4ff] text-[#b2a4ff] bg-white/20 hover:bg-[#8b5cf6]/80 hover:text-white transition-colors duration-200 rounded-full px-4 py-1 text-xs sm:text-sm font-semibold shadow-sm'}
                      disabled={orouIds.includes(request.id)}
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      {orouIds.includes(request.id) ? 'Orado' : 'Orar'}
                    </Button>
                  )}
                  {canDelete(request) && (
                    <Button
                      onClick={() => handleDelete(request.id)}
                      variant="ghost"
                      size="icon"
                      className="text-red-400 hover:bg-red-100/10 hover:text-red-600 rounded-full ml-1"
                      title="Apagar pedido"
                    >
                      <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}