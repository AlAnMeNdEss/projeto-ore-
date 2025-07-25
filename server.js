import express from 'express';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

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

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  throw new Error('A variável de ambiente GEMINI_API_KEY não está definida!');
}

// Endpoint seguro para gerar pedido com IA (Gemini)
app.post('/api/ia-pedido', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt obrigatório' });
  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': geminiApiKey
        }
      }
    );
    const texto = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    res.json({ texto });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao gerar texto com IA' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 