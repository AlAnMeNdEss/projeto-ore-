import express from 'express';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(express.json());

// Configuração do Supabase com service_role
const supabaseUrl = 'https://fidiulbnuucqfckozbrv.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZGl1bGJudXVjcWZja296YnJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDcxMDU4OSwiZXhwIjoyMDY2Mjg2NTg5fQ.geZx43mnZ_yI3qvu4q1Z23NkLcXCGvGpWfoDt2PKi58';

const supabase = createClient(supabaseUrl, serviceRoleKey);

// Exemplo de rota para buscar todos os usuários
app.get('/usuarios', async (req, res) => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Exemplo de rota para inserir um usuário
app.post('/usuarios', async (req, res) => {
  const { nome, email } = req.body;
  const { data, error } = await supabase.from('users').insert([{ nome, email }]);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 