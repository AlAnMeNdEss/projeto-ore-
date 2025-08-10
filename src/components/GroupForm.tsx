import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { CreateGroupData } from '@/types/group';
import { useGroups } from '@/hooks/useGroups';

interface GroupFormProps {
  onSent: () => void;
  onCancel: () => void;
}

export function GroupForm({ onSent, onCancel }: GroupFormProps) {
  const { createGroup } = useGroups();
  const [formData, setFormData] = useState<CreateGroupData>({
    name: '',
    description: '',
    is_private: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Nome do grupo é obrigatório');
      return;
    }

    if (formData.name.length < 3) {
      setError('Nome do grupo deve ter pelo menos 3 caracteres');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await createGroup(formData);
      
      if (result.success) {
        onSent();
      } else {
        setError(result.error || 'Erro ao criar grupo');
      }
    } catch (err) {
      setError('Erro ao criar grupo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative bg-white rounded-2xl p-6 w-full max-w-md mx-auto shadow-2xl"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Criar Novo Grupo</h2>
          <p className="text-gray-600">Crie um grupo de oração para sua comunidade</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div {...fadeUp}>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nome do Grupo *
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Ex: Grupo de Oração da Igreja"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1"
              disabled={loading}
              required
            />
          </motion.div>

          <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Descrição (opcional)
            </Label>
            <Textarea
              id="description"
              placeholder="Descreva o propósito do grupo..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1"
              disabled={loading}
              rows={3}
            />
          </motion.div>

          <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="private" className="text-sm font-medium text-gray-700">
                  Grupo Privado
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Grupos privados só podem ser acessados por convite
                </p>
              </div>
              <Switch
                id="private"
                checked={formData.is_private}
                onCheckedChange={(checked) => setFormData({ ...formData, is_private: checked })}
                disabled={loading}
              />
            </div>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#673AB7] hover:bg-[#5e35b1]"
              disabled={loading}
            >
              {loading ? 'Criando...' : 'Criar Grupo'}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
} 