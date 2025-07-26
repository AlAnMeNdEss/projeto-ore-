import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar a Bíblia uma vez
let bibliaData = null;

function carregarBiblia() {
  if (!bibliaData) {
    try {
      const bibliaPath = path.join(__dirname, '../public/pt_nvi.json');
      const bibliaContent = fs.readFileSync(bibliaPath, 'utf8');
      
      // Remover BOM se presente
      const cleanContent = bibliaContent.charCodeAt(0) === 0xFEFF 
        ? bibliaContent.slice(1) 
        : bibliaContent;
      
      bibliaData = JSON.parse(cleanContent);
      console.log('✅ Bíblia carregada com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao carregar a Bíblia:', error);
      throw error;
    }
  }
  return bibliaData;
}

function normalizarNomeLivro(nome) {
  const normalizacoes = {
    'genesis': 'Gênesis',
    'exodo': 'Êxodo',
    'levitico': 'Levítico',
    'numeros': 'Números',
    'deuteronomio': 'Deuteronômio',
    'josue': 'Josué',
    'juizes': 'Juízes',
    'rute': 'Rute',
    '1samuel': '1 Samuel',
    '2samuel': '2 Samuel',
    '1reis': '1 Reis',
    '2reis': '2 Reis',
    '1cronicas': '1 Crônicas',
    '2cronicas': '2 Crônicas',
    'esdras': 'Esdras',
    'neemias': 'Neemias',
    'ester': 'Ester',
    'jo': 'Jó',
    'salmos': 'Salmos',
    'proverbios': 'Provérbios',
    'eclesiastes': 'Eclesiastes',
    'canticos': 'Cânticos',
    'isaias': 'Isaías',
    'jeremias': 'Jeremias',
    'lamentacoes': 'Lamentações',
    'ezequiel': 'Ezequiel',
    'daniel': 'Daniel',
    'oseias': 'Oseias',
    'joel': 'Joel',
    'amos': 'Amós',
    'obadias': 'Obadias',
    'jonas': 'Jonas',
    'miqueias': 'Miquéias',
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
    'atos': 'Atos',
    'romanos': 'Romanos',
    '1corintios': '1 Coríntios',
    '2corintios': '2 Coríntios',
    'galatas': 'Gálatas',
    'efesios': 'Efésios',
    'filipenses': 'Filipenses',
    'colossenses': 'Colossenses',
    '1tessalonicenses': '1 Tessalonicenses',
    '2tessalonicenses': '2 Tessalonicenses',
    '1timoteo': '1 Timóteo',
    '2timoteo': '2 Timóteo',
    'tito': 'Tito',
    'filemom': 'Filemom',
    'hebreus': 'Hebreus',
    'tiago': 'Tiago',
    '1pedro': '1 Pedro',
    '2pedro': '2 Pedro',
    '1joao': '1 João',
    '2joao': '2 João',
    '3joao': '3 João',
    'judas': 'Judas',
    'apocalipse': 'Apocalipse'
  };
  
  const nomeNormalizado = nome.toLowerCase().replace(/\s+/g, '');
  return normalizacoes[nomeNormalizado] || nome;
}

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const biblia = carregarBiblia();
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);
    
    // Endpoint de status
    if (pathname === '/api/biblia-proxy/status') {
      return res.json({
        status: 'online',
        fonte: 'Local (pt_nvi.json)',
        livros: biblia.length,
        timestamp: new Date().toISOString()
      });
    }
    
    // Endpoint para listar livros
    if (pathname === '/api/biblia-proxy/livros') {
      const livros = biblia.map(livro => ({
        nome: livro.name,
        abreviacao: livro.abbrev,
        capitulos: Object.keys(livro.chapters).length
      }));
      return res.json(livros);
    }
    
    // Endpoint para buscar versículos
    if (pathname === '/api/biblia-proxy/busca') {
      const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
      const termo = searchParams.get('termo');
      
      if (!termo) {
        return res.status(400).json({ error: 'Termo de busca é obrigatório' });
      }
      
      const resultados = [];
      const termoLower = termo.toLowerCase();
      
      biblia.forEach(livro => {
        Object.entries(livro.chapters).forEach(([numeroCapitulo, capitulo]) => {
          Object.entries(capitulo).forEach(([numeroVersiculo, texto]) => {
            if (typeof texto === 'string' && texto.toLowerCase().includes(termoLower)) {
              resultados.push({
                livro: livro.name,
                capitulo: parseInt(numeroCapitulo),
                versiculo: parseInt(numeroVersiculo),
                texto: texto.trim()
              });
            }
          });
        });
      });
      
      return res.json({
        termo: termo,
        total: resultados.length,
        versiculos: resultados.slice(0, 50) // Limitar a 50 resultados
      });
    }
    
    // Endpoint principal para versículos
    if (pathname === '/api/biblia-proxy') {
      const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
      const livro = searchParams.get('livro');
      const capitulo = searchParams.get('capitulo');
      
      if (!livro || !capitulo) {
        return res.status(400).json({ error: 'Livro e capítulo são obrigatórios' });
      }
      
      const nomeLivro = normalizarNomeLivro(livro);
      const livroEncontrado = biblia.find(l => l.name === nomeLivro);
      
      if (!livroEncontrado) {
        return res.status(404).json({ error: `Livro '${nomeLivro}' não encontrado` });
      }
      
      const capituloData = livroEncontrado.chapters[capitulo];
      if (!capituloData) {
        return res.status(404).json({ error: `Capítulo ${capitulo} não encontrado em ${nomeLivro}` });
      }
      
      const versiculos = Object.entries(capituloData).map(([numero, texto]) => ({
        versiculo: parseInt(numero),
        texto: texto.trim()
      }));
      
      return res.json({
        livro: nomeLivro,
        capitulo: parseInt(capitulo),
        totalVersiculos: versiculos.length,
        versiculos: versiculos
      });
    }
    
    // Endpoint para informações de um livro específico
    if (pathname.startsWith('/api/biblia-proxy/livro/')) {
      const nomeLivro = decodeURIComponent(pathname.split('/').pop());
      const livroEncontrado = biblia.find(l => l.name === nomeLivro);
      
      if (!livroEncontrado) {
        return res.status(404).json({ error: `Livro '${nomeLivro}' não encontrado` });
      }
      
      return res.json({
        nome: livroEncontrado.name,
        abreviacao: livroEncontrado.abbrev,
        capitulos: Object.keys(livroEncontrado.chapters).length,
        versiculos: Object.values(livroEncontrado.chapters).reduce((total, capitulo) => 
          total + Object.keys(capitulo).length, 0
        )
      });
    }
    
    return res.status(404).json({ error: 'Endpoint não encontrado' });
    
  } catch (error) {
    console.error('Erro na API:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
} 