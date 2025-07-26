const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const app = express();

const SUPABASE_URL = 'https://fidiulbnuucqfckozbrv.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZGl1bGJudXVjcWZja296YnJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDcxMDU4OSwiZXhwIjoyMDY2Mjg2NTg5fQ.geZx43mnZ_yI3qvu4q1Z23NkLcXCGvGpWfoDt2PKi58';

// Nova chave de API da Bíblia
const BIBLE_API_KEY = '097696d2b8a85d86a19c8f37ce1fc342';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Middleware para CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Rota para buscar versículos usando a nova API
app.get('/api/biblia', async (req, res) => {
  const { livro, capitulo, traducao = 'almeida_ra' } = req.query;
  
  if (!livro || !capitulo) {
    return res.status(400).json({ error: 'Informe livro e capitulo' });
  }

  try {
    // Usar a nova API da Bíblia com a chave fornecida
    const ref = encodeURIComponent(`${livro} ${capitulo}`);
    const url = `https://api.biblesupersearch.com/api?bible=${traducao}&reference=${ref}&key=${BIBLE_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.errors && data.errors.length > 0) {
      return res.status(400).json({ error: data.errors.join(' ') });
    }

    // Processar os resultados
    const results = data.results && data.results.length > 0 ? data.results[0] : null;
    if (results && results.verses && results.verses[traducao]) {
      const cap = results.verses[traducao][capitulo];
      if (cap) {
        const versiculos = Object.values(cap).map((v) => ({
          versiculo: v.verse,
          texto: v.text.replace(/<[^>]+>/g, '').replace(/¶/g, '').trim()
        }));
        res.json(versiculos);
      } else {
        res.json([]);
      }
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('Erro na API da Bíblia:', error);
    res.status(500).json({ error: 'Erro ao buscar versículos' });
  }
});

// Rota para busca por palavra-chave
app.get('/api/biblia/busca', async (req, res) => {
  const { termo, traducao = 'almeida_ra' } = req.query;
  
  if (!termo) {
    return res.status(400).json({ error: 'Informe o termo de busca' });
  }

  try {
    const search = encodeURIComponent(termo.trim());
    const url = `https://api.biblesupersearch.com/api?bible=${traducao}&search=${search}&key=${BIBLE_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.errors && data.errors.length > 0) {
      return res.status(400).json({ error: data.errors.join(' ') });
    }

    // Processar resultados de busca
    let encontrados = [];
    if (Array.isArray(data.results)) {
      data.results.forEach((passagem) => {
        if (passagem.verses && passagem.verses[traducao]) {
          Object.values(passagem.verses[traducao]).forEach((cap) => {
            Object.values(cap).forEach((v) => {
              encontrados.push({
                versiculo: v.verse,
                texto: v.text.replace(/<[^>]+>/g, '').replace(/¶/g, '').trim(),
                livro: passagem.book_name,
                capitulo: passagem.chapter
              });
            });
          });
        }
      });
    }

    res.json(encontrados);
  } catch (error) {
    console.error('Erro na busca da Bíblia:', error);
    res.status(500).json({ error: 'Erro ao buscar na Bíblia' });
  }
});

// Rota para listar traduções disponíveis
app.get('/api/biblia/traducoes', async (req, res) => {
  try {
    const url = `https://api.biblesupersearch.com/api?bibles=1&key=${BIBLE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.errors && data.errors.length > 0) {
      return res.status(400).json({ error: data.errors.join(' ') });
    }

    res.json(data.bibles || {});
  } catch (error) {
    console.error('Erro ao listar traduções:', error);
    res.status(500).json({ error: 'Erro ao listar traduções' });
  }
});

// Rota para verificar status da API
app.get('/api/biblia/status', async (req, res) => {
  try {
    const url = `https://api.biblesupersearch.com/api?bible=almeida_ra&reference=João 3:16&key=${BIBLE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.errors && data.errors.length > 0) {
      res.json({ status: 'error', message: data.errors.join(' ') });
    } else {
      res.json({ status: 'ok', message: 'API funcionando corretamente' });
    }
  } catch (error) {
    res.json({ status: 'error', message: 'Erro ao conectar com a API' });
  }
});

app.listen(3001, () => {
  console.log('API da Bíblia rodando na porta 3001');
  console.log('Chave da API configurada:', BIBLE_API_KEY ? '✅' : '❌');
}); 