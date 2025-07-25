import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { usePrayerRequests } from '@/hooks/usePrayerRequests';
import { useAuth } from '@/hooks/useAuth';
import { Send, Heart, Loader2 } from 'lucide-react';

export function PrayerRequestForm({ refreshRequests, onSent, onCancel }: { refreshRequests?: () => void, onSent?: () => void, onCancel?: () => void }) {
  const { createRequest } = usePrayerRequests();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [iaLoading, setIaLoading] = useState(false);
  
  const [form, setForm] = useState({
    text: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.text.trim()) return;

    setLoading(true);
    
    let name = null;
    if (!isAnonymous && user && user.user_metadata && user.user_metadata.name) {
      name = user.user_metadata.name;
    }
    const userId = user?.id;
    
    const result = await createRequest(
      form.text.trim(),
      undefined, // categoria removida
      name,
      userId
    );

    if (result.success) {
      setForm({ text: '' });
      setIsAnonymous(false);
      if (refreshRequests) refreshRequests();
      if (onSent) onSent();
    }
    
    setLoading(false);
  };

  async function escreverComIA() {
    setIaLoading(true);
    try {
      const prompt = 'Escreva um pedido de oração bonito, respeitoso e inspirador.';
      const res = await fetch('/api/ia-pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      if (data.texto) {
        setForm(f => ({ ...f, text: data.texto }));
      }
    } catch (e) {
      alert('Erro ao gerar texto com IA.');
    }
    setIaLoading(false);
  }

  const canSubmit = form.text.trim() && !loading;

  return (
    <div className="max-w-xs w-full bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center mx-auto">
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <h2 className="text-2xl font-extrabold text-[#23232b] text-center mb-2">Novo Pedido de Oração</h2>
        <textarea
          id="text"
          value={form.text}
          onChange={e => setForm({ text: e.target.value })}
          placeholder="Escreva o seu pedido ou palavras-chave..."
          className="w-full min-h-[100px] rounded-xl border border-[#ececec] bg-white text-[#23232b] placeholder-[#b0b0b0] p-4 text-base focus:outline-none focus:ring-2 focus:ring-[#a084e8]"
          disabled={loading}
          required
        />
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#f3e8ff] text-[#7c3aed] font-semibold text-base mb-1 hover:bg-[#e9d8fd] transition"
          onClick={escreverComIA}
          disabled={iaLoading || loading}
        >
          {iaLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span className="text-lg">✨</span>}
          Escrever com IA
        </button>
        <label className="flex items-center gap-2 text-[#23232b] text-base mb-2">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={e => setIsAnonymous(e.target.checked)}
            disabled={loading}
            className="w-5 h-5 rounded border border-[#b0b0b0] focus:ring-[#a084e8]"
          />
          Publicar anonimamente
        </label>
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            className="flex-1 py-3 rounded-xl bg-[#ececec] text-[#23232b] font-semibold text-base hover:bg-[#e0e0e0] transition"
            onClick={() => onCancel ? onCancel() : window.history.back()}
            tabIndex={0}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 py-3 rounded-xl bg-[#7c3aed] text-white font-semibold text-base hover:bg-[#5f2fc1] transition"
            disabled={!canSubmit}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />}
            Enviar Pedido
          </button>
        </div>
      </form>
    </div>
  );
}