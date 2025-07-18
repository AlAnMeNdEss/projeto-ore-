import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePrayerRequests } from '@/hooks/usePrayerRequests';
import { useAuth } from '@/hooks/useAuth';
import { PRAYER_CATEGORIES, PrayerCategory } from '@/types/prayer';
import { formatDistanceToNow } from 'date-fns';
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
            <Card key={request.id} className="shadow-soft border-0 hover:shadow-prayer transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-prayer-accent text-prayer-primary">
                      {PRAYER_CATEGORIES[request.category]}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(request.created_at), { 
                        addSuffix: true, 
                        locale: ptBR 
                      })}
                    </span>
                  </div>
                  {canDelete(request) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(request.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {request.name && (
                  <CardDescription>
                    Por: {request.name}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-foreground mb-4 whitespace-pre-wrap leading-relaxed">
                  {request.text}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Heart className="h-4 w-4 text-prayer-success" />
                    <span>
                      {request.prayer_count} {request.prayer_count === 1 ? 'oração' : 'orações'}
                    </span>
                  </div>
                  {user && (
                    <Button
                      onClick={() => handlePray(request.id)}
                      variant="outline"
                      size="sm"
                      className="border-prayer-primary text-prayer-primary hover:bg-prayer-primary hover:text-white"
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      Orar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}