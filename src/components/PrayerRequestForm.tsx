import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { usePrayerRequests } from '@/hooks/usePrayerRequests';
import { useAuth } from '@/hooks/useAuth';
import { PRAYER_CATEGORIES, PrayerCategory } from '@/types/prayer';
import { Send, Heart, Loader2 } from 'lucide-react';

export function PrayerRequestForm() {
  const { createRequest } = usePrayerRequests();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  const [form, setForm] = useState({
    text: '',
    category: '' as PrayerCategory,
    name: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.text.trim() || !form.category) return;

    setLoading(true);
    
    const name = isAnonymous ? undefined : (form.name.trim() || undefined);
    const userId = user?.id;
    
    const result = await createRequest(
      form.text.trim(),
      form.category,
      name,
      userId
    );

    if (result.success) {
      setForm({ text: '', category: '' as PrayerCategory, name: '' });
      setIsAnonymous(false);
    }
    
    setLoading(false);
  };

  const canSubmit = form.text.trim() && form.category && !loading;

  return (
    <Card className="shadow-prayer border-0">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-prayer-primary" />
          Compartilhar Pedido de Oração
        </CardTitle>
        <CardDescription>
          Compartilhe seu pedido com nossa comunidade de oração
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select
              value={form.category}
              onValueChange={(value: PrayerCategory) => setForm({...form, category: value})}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PRAYER_CATEGORIES).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="text">Seu Pedido</Label>
            <Textarea
              id="text"
              value={form.text}
              onChange={(e) => setForm({...form, text: e.target.value})}
              placeholder="Descreva seu pedido de oração..."
              className="min-h-[100px] resize-none"
              disabled={loading}
              required
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-prayer-secondary rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="anonymous">Pedido Anônimo</Label>
              <p className="text-sm text-muted-foreground">
                Seu pedido será mostrado sem identificação
              </p>
            </div>
            <Switch
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
              disabled={loading}
            />
          </div>

          {!isAnonymous && (
            <div className="space-y-2">
              <Label htmlFor="name">Nome (opcional)</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                placeholder="Seu nome ou iniciais"
                disabled={loading}
              />
              <p className="text-sm text-muted-foreground">
                Deixe em branco para usar o nome do seu perfil
              </p>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-gradient-prayer" 
            disabled={!canSubmit}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Send className="mr-2 h-4 w-4" />
            Enviar Pedido
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}