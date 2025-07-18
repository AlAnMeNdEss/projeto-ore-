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
    <Card className="rounded-2xl border border-[#a78bfa] bg-[#2d1457] shadow-xl text-gray-100">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-[#a78bfa] text-2xl font-bold">
          <Heart className="h-5 w-5 text-[#f3e8ff]" />
          Compartilhar Pedido de Oração
        </CardTitle>
        <CardDescription className="text-gray-300">
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
                {form.category ? (
                  <span className="flex items-center gap-2 text-[#8b5cf6] font-semibold">
                    {PRAYER_CATEGORIES[form.category]}
                  </span>
                ) : (
                  <SelectValue placeholder="Selecione uma categoria" />
                )}
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
              className="min-h-[100px] resize-none bg-[#1a093e] border border-[#a78bfa] text-gray-100 placeholder:text-gray-400 focus:border-[#f3e8ff] focus:ring-[#a78bfa]"
              disabled={loading}
              required
            />
          </div>

          <div className="flex flex-col items-center justify-center my-4">
            <div className="flex items-center gap-2 bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 rounded-xl px-4 py-2 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#8b5cf6]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2a1 1 0 001 1h14a1 1 0 001-1v-2c0-2.66-5.33-4-8-4z" /></svg>
              <span className="text-[#8b5cf6] font-bold text-sm">Pedido Anônimo</span>
              <Switch
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
                disabled={loading}
                className="ml-2"
              />
            </div>
            <span className="text-xs text-[#8b5cf6] mt-1 text-center">Seu pedido será mostrado sem identificação</span>
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
                className="bg-[#1a093e] border border-[#a78bfa] text-gray-100 placeholder:text-gray-400 focus:border-[#f3e8ff] focus:ring-[#a78bfa]"
              />
              <p className="text-sm text-muted-foreground">
                Deixe em branco para não exibir nenhum nome.
              </p>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-[#a78bfa] via-[#f3e8ff] to-[#6d28d9] text-[#2d1457] font-bold py-3 rounded-xl shadow-md hover:brightness-110 transition-all duration-200 mt-4"
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