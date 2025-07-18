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

export function PrayerRequestsList() {
  const { requests, loading, prayForRequest, deleteRequest } = usePrayerRequests();
  const { user } = useAuth();
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredRequests = requests.filter(request => {
    if (filterCategory === 'all') return true;
    return request.category === filterCategory;
  });

  const handlePray = async (requestId: string) => {
    if (!user) return;
    await prayForRequest(requestId, user.id);
  };

  const handleDelete = async (requestId: string) => {
    if (!user) return;
    await deleteRequest(requestId);
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
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Filter className="h-5 w-5 text-muted-foreground" />
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[200px]">
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

      {filteredRequests.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {filterCategory === 'all' 
                ? 'Nenhum pedido de oração foi compartilhado ainda.'
                : 'Nenhum pedido encontrado nesta categoria.'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map(request => (
            <Card key={request.id} className="relative rounded-3xl border-0 bg-[#2d1457]/80 shadow-xl mb-6 p-0 backdrop-blur-md overflow-hidden">
              {/* Detalhe decorativo no topo */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#a78bfa] via-[#f3e8ff] to-[#6d28d9] opacity-40 rounded-t-3xl" />
              <CardHeader className="pb-2 flex flex-row items-center gap-3 border-b border-white/10 px-6 pt-6">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#a78bfa] via-[#f3e8ff] to-[#6d28d9] text-white text-2xl shadow-md">
                  {CATEGORY_ICONS[request.category] || '✨'}
                </span>
                <div className="flex-1">
                  <span className="font-semibold text-[#b2a4ff] text-base mr-2">
                    {PRAYER_CATEGORIES[request.category] || 'Categoria desconhecida'}
                  </span>
                  <span className="text-xs text-gray-200/80">
                    {formatDistanceToNow(new Date(request.created_at), { addSuffix: true, locale: ptBR })}
                    <span className="mx-1">•</span>
                    {format(new Date(request.created_at), 'dd/MM/yyyy')}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-2 pb-4 px-6">
                {request.name && (
                  <div className="text-xs text-gray-300 mb-1">
                    <span className="font-semibold">Por:</span> {request.name}
                  </div>
                )}
                <p className="text-white mb-4 whitespace-pre-wrap leading-relaxed text-base font-medium">
                  {request.text}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2 text-sm text-[#b2a4ff] font-semibold">
                    <Heart className="h-4 w-4 text-pink-400" />
                    <span>
                      {request.prayer_count} {request.prayer_count === 1 ? 'oração' : 'orações'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {user && (
                      <Button
                        onClick={() => handlePray(request.id)}
                        variant="outline"
                        size="sm"
                        className="border-[#b2a4ff] text-[#b2a4ff] bg-[#3a1c71]/60 hover:bg-[#8b5cf6]/80 hover:text-[#3a1c71] transition-colors duration-200 rounded-full px-5 py-1 text-sm font-semibold shadow-md"
                      >
                        <Heart className="h-4 w-4 mr-1" />
                        Orar
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
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}