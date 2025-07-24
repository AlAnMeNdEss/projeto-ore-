import React, { useState, useEffect } from 'react';

const traducoes = [
  // Português
  { value: 'almeida_ra', label: 'Almeida RA (Português)' },
  { value: 'almeida_rc', label: 'Almeida RC (Português)' },
  { value: 'blivre', label: 'Bíblia Livre (Português)' },
  // Inglês
  { value: 'kjv', label: 'King James (KJV) (Inglês)' },
  { value: 'kjv_strongs', label: 'KJV com Strongs (Inglês)' },
  { value: 'asv', label: 'American Standard Version (Inglês)' },
  { value: 'geneva', label: 'Geneva Bible (Inglês)' },
  { value: 'web', label: 'World English Bible (Inglês)' },
  { value: 'bishops', label: 'Bishops Bible (Inglês)' },
  { value: 'coverdale', label: 'Coverdale Bible (Inglês)' },
  { value: 'tyndale', label: 'Tyndale Bible (Inglês)' },
  // Espanhol
  { value: 'rv_1909', label: 'Reina Valera 1909 (Espanhol)' },
  { value: 'rv_1858', label: 'Reina Valera 1858 (Espanhol)' },
  { value: 'rvg', label: 'Reina Valera Gómez (Espanhol)' },
  { value: 'sagradas', label: 'Sagradas Escrituras (Espanhol)' },
  // Francês
  { value: 'segond_1910', label: 'Louis Segond 1910 (Francês)' },
  { value: 'ostervald', label: 'Ostervald (Francês)' },
  { value: 'martin', label: 'Martin (Francês)' },
  // Alemão
  { value: 'luther', label: 'Luther Bible (Alemão)' },
  { value: 'luther_1912', label: 'Luther Bible 1912 (Alemão)' },
  // Hebraico
  { value: 'wlc', label: 'WLC (Hebraico)' },
  // Grego
  { value: 'tr', label: 'Textus Receptus (Grego)' },
  { value: 'trparsed', label: 'Textus Receptus Parsed (Grego)' },
];

const livros = [
  'Gênesis', 'Êxodo', 'Levítico', 'Números', 'Deuteronômio', 'Josué', 'Juízes', 'Rute', '1 Samuel', '2 Samuel',
  '1 Reis', '2 Reis', '1 Crônicas', '2 Crônicas', 'Esdras', 'Neemias', 'Ester', 'Jó', 'Salmos', 'Provérbios',
  'Eclesiastes', 'Cânticos', 'Isaías', 'Jeremias', 'Lamentações', 'Ezequiel', 'Daniel', 'Oseias', 'Joel', 'Amós',
  'Obadias', 'Jonas', 'Miquéias', 'Naum', 'Habacuque', 'Sofonias', 'Ageu', 'Zacarias', 'Malaquias',
  'Mateus', 'Marcos', 'Lucas', 'João', 'Atos', 'Romanos', '1 Coríntios', '2 Coríntios', 'Gálatas', 'Efésios',
  'Filipenses', 'Colossenses', '1 Tessalonicenses', '2 Tessalonicenses', '1 Timóteo', '2 Timóteo', 'Tito', 'Filemom',
  'Hebreus', 'Tiago', '1 Pedro', '2 Pedro', '1 João', '2 João', '3 João', 'Judas', 'Apocalipse'
];

// Função utilitária para limpar tags HTML e caracteres especiais
function limparTexto(texto: string) {
  return texto
    .replace(/<[^>]+>/g, '') // Remove tags HTML
    .replace(/¶/g, '') // Remove símbolo de parágrafo
    .replace(/\s+/g, ' ') // Remove espaços extras
    .trim();
}

export function Biblia() {
  const [traducao, setTraducao] = useState('almeida_ra');
  const [livro, setLivro] = useState('Salmos');
  const [capitulo, setCapitulo] = useState(23);
  const [versiculos, setVersiculos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');
  const [buscando, setBuscando] = useState(false);

  // Exemplo de capítulos (pode ser dinâmico depois)
  const capitulos = Array.from({ length: 150 }, (_, i) => i + 1);

  useEffect(() => {
    let cancelado = false;
    async function fetchVersiculos() {
      setLoading(true);
      setErro('');
      setVersiculos([]);
      try {
        let url = '';
        if (busca.trim() !== '') {
          setBuscando(true);
          const search = encodeURIComponent(busca.trim());
          url = `https://api.biblesupersearch.com/api?bible=${traducao}&search=${search}`;
        } else {
          setBuscando(false);
          const ref = encodeURIComponent(`${livro} ${capitulo}`);
          url = `https://api.biblesupersearch.com/api?bible=${traducao}&reference=${ref}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        if (cancelado) return;
        if (data.errors && data.errors.length > 0) {
          setErro(data.errors.join(' '));
        } else {
          if (busca.trim() !== '') {
            let encontrados: any[] = [];
            if (Array.isArray(data.results)) {
              data.results.forEach((passagem: any) => {
                if (passagem.verses && passagem.verses[traducao]) {
                  Object.values(passagem.verses[traducao]).forEach((cap: any) => {
                    Object.values(cap).forEach((v: any) => encontrados.push(v));
                  });
                }
              });
            }
            setVersiculos(encontrados);
          } else {
            const results = data.results && data.results.length > 0 ? data.results[0] : null;
            if (results && results.verses && results.verses[traducao]) {
              const cap = results.verses[traducao][capitulo];
              if (cap) {
                setVersiculos(Object.values(cap));
              } else {
                setVersiculos([]);
              }
            } else {
              setVersiculos([]);
            }
          }
        }
      } catch (e) {
        if (!cancelado) setErro('Erro ao buscar versículos.');
      }
      if (!cancelado) setLoading(false);
    }
    fetchVersiculos();
    return () => { cancelado = true; };
  }, [livro, capitulo, traducao, busca]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center px-2 pt-6 bg-[#f6eaff]">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#23232b] text-center mb-6">Bíblia Sagrada</h1>
      <div className="w-full max-w-md mb-4 flex items-center gap-2">
        <input
          type="text"
          className="flex-1 rounded-xl border border-[#ececec] bg-white text-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#a084e8]"
          placeholder="Buscar palavra-chave..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
        {busca && (
          <button onClick={() => setBusca('')} className="text-[#a084e8] font-bold px-2 py-1 rounded hover:bg-[#ede9fe] transition">Limpar</button>
        )}
      </div>
      <div className="flex gap-2 w-full max-w-md mb-6 px-2 overflow-x-auto">
        <select
          className="w-40 min-w-0 rounded-xl border border-[#ececec] bg-white text-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#a084e8]"
          value={traducao}
          onChange={e => setTraducao(e.target.value)}
        >
          {traducoes.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <select
          className="flex-1 min-w-0 rounded-xl border border-[#ececec] bg-white text-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#a084e8]"
          value={livro}
          onChange={e => setLivro(e.target.value)}
        >
          {livros.map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        <select
          className="w-20 min-w-0 rounded-xl border border-[#ececec] bg-white text-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#a084e8]"
          value={capitulo}
          onChange={e => setCapitulo(Number(e.target.value))}
        >
          {capitulos.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="w-full max-w-md bg-white/80 rounded-xl p-4 min-h-[200px]">
        {loading && <div className="text-center text-[#7c3aed]">Carregando...</div>}
        {erro && <div className="text-center text-red-500 font-semibold">{erro}</div>}
        {!loading && !erro && versiculos.length > 0 && (
          <div className="flex flex-col gap-3">
            {!buscando && (
              <h2 className="text-xl font-bold text-[#23232b] mb-2">{livro} {capitulo}</h2>
            )}
            {versiculos.map((v: any, i: number) => (
              <div key={v.verse + '-' + i} className="flex items-start gap-2">
                <span className="text-[#a084e8] font-bold select-none" style={{minWidth: 18}}>{v.verse}</span>
                <span className="text-lg text-[#23232b] leading-relaxed">
                  {limparTexto(v.text)}
                </span>
              </div>
            ))}
          </div>
        )}
        {!loading && !erro && versiculos.length === 0 && (
          <div className="text-center text-[#23232b]">Nenhum versículo encontrado.</div>
        )}
      </div>
    </div>
  );
} 