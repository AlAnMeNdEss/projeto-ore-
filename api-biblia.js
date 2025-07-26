import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware para CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Carregar a Bíblia uma vez na inicialização
let bibliaData = null;

try {
  const bibliaPath = path.join(__dirname, 'public', 'pt_nvi.json');
  let bibliaContent = fs.readFileSync(bibliaPath, 'utf8');
  
  // Remover BOM se existir
  if (bibliaContent.charCodeAt(0) === 0xFEFF) {
    bibliaContent = bibliaContent.slice(1);
  }
  
  bibliaData = JSON.parse(bibliaContent);
  console.log('✅ Bíblia carregada com sucesso!');
  console.log(`📚 ${bibliaData.length} livros disponíveis`);
} catch (error) {
  console.error('❌ Erro ao carregar a Bíblia:', error.message);
  process.exit(1);
}

// Função para normalizar nomes de livros
function normalizarNomeLivro(nome) {
  const normalizacoes = {
    'genesis': 'Gênesis',
    'gênesis': 'Gênesis',
    'exodo': 'Êxodo',
    'êxodo': 'Êxodo',
    'levitico': 'Levítico',
    'levítico': 'Levítico',
    'numeros': 'Números',
    'números': 'Números',
    'deuteronomio': 'Deuteronômio',
    'deuteronômio': 'Deuteronômio',
    'jose': 'Josué',
    'josué': 'Josué',
    'juizes': 'Juízes',
    'juízes': 'Juízes',
    'rute': 'Rute',
    '1samuel': '1 Samuel',
    '1 samuel': '1 Samuel',
    '2samuel': '2 Samuel',
    '2 samuel': '2 Samuel',
    '1reis': '1 Reis',
    '1 reis': '1 Reis',
    '2reis': '2 Reis',
    '2 reis': '2 Reis',
    '1cronicas': '1 Crônicas',
    '1 crônicas': '1 Crônicas',
    '1cron': '1 Crônicas',
    '2cronicas': '2 Crônicas',
    '2 crônicas': '2 Crônicas',
    '2cron': '2 Crônicas',
    'esdras': 'Esdras',
    'neemias': 'Neemias',
    'ester': 'Ester',
    'job': 'Jó',
    'jó': 'Jó',
    'salmos': 'Salmos',
    'proverbios': 'Provérbios',
    'provérbios': 'Provérbios',
    'eclesiastes': 'Eclesiastes',
    'canticos': 'Cânticos',
    'cânticos': 'Cânticos',
    'cantares': 'Cânticos',
    'cantares de salomao': 'Cânticos',
    'isaías': 'Isaías',
    'isaías': 'Isaías',
    'jeremias': 'Jeremias',
    'lamentacoes': 'Lamentações de Jeremias',
    'lamentações': 'Lamentações de Jeremias',
    'ezequiel': 'Ezequiel',
    'daniel': 'Daniel',
    'oseias': 'Oséias',
    'oséias': 'Oséias',
    'joel': 'Joel',
    'amos': 'Amós',
    'amós': 'Amós',
    'obadias': 'Obadias',
    'jonas': 'Jonas',
    'miqueias': 'Miquéias',
    'miquéias': 'Miquéias',
    'naum': 'Naum',
    'habacuque': 'Habacuque',
    'sofonias': 'Sofonias',
    'ageu': 'Ageu',
    'zacarias': 'Zacarias',
    'malaquias': 'Malaquias',
    'mateus': 'Mateus',
    'marcos': 'Marcos',
    'lucas': 'Lucas',
    'joao': 'João',
    'joão': 'João',
    'atos': 'Atos',
    'atos dos apostolos': 'Atos',
    'romanos': 'Romanos',
    '1corintios': '1 Coríntios',
    '1 coríntios': '1 Coríntios',
    '2corintios': '2 Coríntios',
    '2 coríntios': '2 Coríntios',
    'galatas': 'Gálatas',
    'gálatas': 'Gálatas',
    'efesios': 'Efésios',
    'efésios': 'Efésios',
    'filipenses': 'Filipenses',
    'colossenses': 'Colossenses',
    '1tessalonicenses': '1 Tessalonicenses',
    '1 tessalonicenses': '1 Tessalonicenses',
    '2tessalonicenses': '2 Tessalonicenses',
    '2 tessalonicenses': '2 Tessalonicenses',
    '1timoteo': '1 Timóteo',
    '1 timóteo': '1 Timóteo',
    '2timoteo': '2 Timóteo',
    '2 timóteo': '2 Timóteo',
    'tito': 'Tito',
    'filemom': 'Filemom',
    'hebreus': 'Hebreus',
    'tiago': 'Tiago',
    '1pedro': '1 Pedro',
    '1 pedro': '1 Pedro',
    '2pedro': '2 Pedro',
    '2 pedro': '2 Pedro',
    '1joao': '1 João',
    '1 joão': '1 João',
    '2joao': '2 João',
    '2 joão': '2 João',
    '3joao': '3 João',
    '3 joão': '3 João',
    'judas': 'Judas',
    'apocalipse': 'Apocalipse',
    'revelacao': 'Apocalipse',
    'revelação': 'Apocalipse'
  };
  
  const nomeLower = nome.toLowerCase().trim();
  return normalizacoes[nomeLower] || nome;
}

// Função para encontrar um livro
function encontrarLivro(nomeLivro) {
  const nomeNormalizado = normalizarNomeLivro(nomeLivro);
  return bibliaData.find(livro => 
    livro.book.toLowerCase() === nomeNormalizado.toLowerCase() ||
    livro.abbrev.toLowerCase() === nomeLivro.toLowerCase()
  );
}

// Rota principal para buscar versículos
app.get('/api/biblia', (req, res) => {
  const { livro, capitulo } = req.query;

  if (!livro || !capitulo) {
    return res.status(400).json({ 
      error: 'Informe livro e capitulo',
      exemplo: '/api/biblia?livro=Salmos&capitulo=23'
    });
  }

  try {
    const livroEncontrado = encontrarLivro(livro);
    
    if (!livroEncontrado) {
      return res.status(404).json({ 
        error: `Livro "${livro}" não encontrado`,
        livros_disponiveis: bibliaData.map(l => l.book)
      });
    }

    const capituloNum = parseInt(capitulo);
    if (isNaN(capituloNum) || capituloNum < 1) {
      return res.status(400).json({ 
        error: 'Capítulo deve ser um número válido maior que 0' 
      });
    }

    // Verificar se o capítulo existe
    if (capituloNum > livroEncontrado.chapters.length) {
      return res.status(404).json({ 
        error: `Capítulo ${capituloNum} não existe em ${livroEncontrado.book}`,
        max_capitulos: livroEncontrado.chapters.length
      });
    }

    const capituloData = livroEncontrado.chapters[capituloNum - 1];
    if (!capituloData || !capituloData[capituloNum.toString()]) {
      return res.status(404).json({ 
        error: `Capítulo ${capituloNum} não encontrado em ${livroEncontrado.book}` 
      });
    }

    // Converter para o formato esperado pelo frontend
    const versiculos = Object.entries(capituloData[capituloNum.toString()]).map(([numero, texto]) => ({
      versiculo: numero,
      texto: texto
    }));

    res.json(versiculos);

  } catch (error) {
    console.error('Erro ao buscar versículos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para busca por palavra-chave
app.get('/api/biblia/busca', (req, res) => {
  const { termo } = req.query;

  if (!termo) {
    return res.status(400).json({ 
      error: 'Informe o termo de busca',
      exemplo: '/api/biblia/busca?termo=amor'
    });
  }

  try {
    const termoLower = termo.toLowerCase();
    const encontrados = [];

    // Buscar em todos os livros
    bibliaData.forEach(livro => {
      livro.chapters.forEach((capitulo, indexCapitulo) => {
        // Verificar se o capítulo é um objeto válido
        if (capitulo && typeof capitulo === 'object') {
          const numeroCapitulo = (indexCapitulo + 1).toString();
          const versiculosCapitulo = capitulo[numeroCapitulo];
          
          if (versiculosCapitulo && typeof versiculosCapitulo === 'object') {
            Object.entries(versiculosCapitulo).forEach(([numero, texto]) => {
              if (texto && typeof texto === 'string' && texto.toLowerCase().includes(termoLower)) {
                encontrados.push({
                  versiculo: numero,
                  texto: texto,
                  livro: livro.book,
                  capitulo: indexCapitulo + 1
                });
              }
            });
          }
        }
      });
    });

    // Limitar resultados para não sobrecarregar
    const resultadosLimitados = encontrados.slice(0, 100);

    res.json({
      termo: termo,
      total_encontrado: encontrados.length,
      resultados: resultadosLimitados,
      limitado: encontrados.length > 100
    });

  } catch (error) {
    console.error('Erro na busca:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para listar todos os livros
app.get('/api/biblia/livros', (req, res) => {
  try {
    const livros = bibliaData.map(livro => ({
      abbrev: livro.abbrev,
      book: livro.book,
      capitulos: livro.chapters.length
    }));

    res.json({
      total: livros.length,
      livros: livros
    });
  } catch (error) {
    console.error('Erro ao listar livros:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para verificar status da API
app.get('/api/biblia/status', (req, res) => {
  try {
    res.json({ 
      status: 'ok', 
      message: 'API da Bíblia funcionando corretamente',
      livros_carregados: bibliaData.length,
      fonte: 'Local (pt_nvi.json)',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Erro na API da Bíblia' 
    });
  }
});

// Rota para obter informações de um livro específico
app.get('/api/biblia/livro/:nome', (req, res) => {
  const { nome } = req.params;

  try {
    const livro = encontrarLivro(nome);
    
    if (!livro) {
      return res.status(404).json({ 
        error: `Livro "${nome}" não encontrado`,
        livros_disponiveis: bibliaData.map(l => l.book)
      });
    }

    res.json({
      abbrev: livro.abbrev,
      book: livro.book,
      capitulos: livro.chapters.length,
      primeiro_versiculo: Object.values(livro.chapters[0])[0] || 'N/A'
    });

  } catch (error) {
    console.error('Erro ao buscar livro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.listen(3001, () => {
  console.log('🚀 API da Bíblia rodando na porta 3001');
  console.log('📖 Fonte: Local (pt_nvi.json)');
  console.log('🌐 Endpoints disponíveis:');
  console.log('   GET /api/biblia?livro=Salmos&capitulo=23');
  console.log('   GET /api/biblia/busca?termo=amor');
  console.log('   GET /api/biblia/livros');
  console.log('   GET /api/biblia/status');
  console.log('   GET /api/biblia/livro/Salmos');
}); 