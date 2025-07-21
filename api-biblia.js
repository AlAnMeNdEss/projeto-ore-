const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const app = express();

const SUPABASE_URL = 'https://fidiulbnuucqfckozbrv.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZGl1bGJudXVjcWZja296YnJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDcxMDU4OSwiZXhwIjoyMDY2Mjg2NTg5fQ.geZx43mnZ_yI3qvu4q1Z23NkLcXCGvGpWfoDt2PKi58';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

app.get('/api/biblia', async (req, res) => {
  const { livro, capitulo } = req.query;
  if (!livro || !capitulo) {
    return res.status(400).json({ error: 'Informe livro e capitulo' });
  }
  const { data, error } = await supabase
    .from('biblia')
    .select('versiculo, texto')
    .eq('livro', livro)
    .eq('capitulo', capitulo)
    .order('versiculo', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.listen(3001, () => console.log('API da Bíblia rodando na porta 3001')); 