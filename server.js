import express from 'express';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(express.json());

// Configuração do Supabase com service_role
const supabaseUrl = 'https://fidiulbnuucqfckozbrv.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE;
if (!serviceRoleKey) {
  throw new Error('A variável de ambiente SUPABASE_SERVICE_ROLE não está definida!');
}

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