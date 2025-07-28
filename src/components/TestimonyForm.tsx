import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface TestimonyFormProps {
  onSent: () => void;
  onCancel: () => void;
}

export function TestimonyForm({ onSent, onCancel }: TestimonyFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, preencha todos os campos."
      });
      return;
    }

    if (!user) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Você precisa estar logado para compartilhar um testemunho."
      });
      return;
    }

    setLoading(true);
    
    try {
      // TODO: Implementar inserção no Supabase
      console.log('Criando testemunho:', { title, content, userId: user.id });
      
      // Simular sucesso por enquanto
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Testemunho compartilhado!",
        description: "Seu testemunho foi publicado com sucesso."
      });
      
      onSent();
    } catch (error) {
      console.error('Erro ao criar testemunho:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível compartilhar o testemunho. Tente novamente."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      
      <Card className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#673AB7]">Compartilhar Testemunho</h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
              Título do Testemunho
            </Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Milagre no Emprego"
              className="mt-1"
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="content" className="text-sm font-semibold text-gray-700">
              Seu Testemunho
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Compartilhe como Deus agiu na sua vida..."
              className="mt-1 min-h-[120px] resize-none"
              disabled={loading}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !title.trim() || !content.trim()}
              className="flex-1 bg-[#673AB7] hover:bg-[#5e35b1]"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Compartilhar'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
} 