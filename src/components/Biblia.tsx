import React, { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

const livros = [
  'Gênesis', 'Êxodo', 'Levítico', 'Números', 'Deuteronômio', 'Josué', 'Juízes', 'Rute', '1 Samuel', '2 Samuel',
  '1 Reis', '2 Reis', '1 Crônicas', '2 Crônicas', 'Esdras', 'Neemias', 'Ester', 'Jó', 'Salmos', 'Provérbios',
  'Eclesiastes', 'Cânticos', 'Isaías', 'Jeremias', 'Lamentações', 'Ezequiel', 'Daniel', 'Oseias', 'Joel', 'Amós',
  'Obadias', 'Jonas', 'Miquéias', 'Naum', 'Habacuque', 'Sofonias', 'Ageu', 'Zacarias', 'Malaquias',
  'Mateus', 'Marcos', 'Lucas', 'João', 'Atos', 'Romanos', '1 Coríntios', '2 Coríntios', 'Gálatas', 'Efésios',
  'Filipenses', 'Colossenses', '1 Tessalonicenses', '2 Tessalonicenses', '1 Timóteo', '2 Timóteo', 'Tito', 'Filemom',
  'Hebreus', 'Tiago', '1 Pedro', '2 Pedro', '1 João', '2 João', '3 João', 'Judas', 'Apocalipse'
];

export function Biblia({ setShowNavBar, onShowNavBar }: { setShowNavBar?: Dispatch<SetStateAction<boolean>>; onShowNavBar?: (show: boolean) => void }) {
  const [livro, setLivro] = useState('Salmos');
  const [capitulo, setCapitulo] = useState(23);
  const [themeMode, setThemeMode] = useState(0);
  
  const darkMode = themeMode === 1;
  const whiteMode = themeMode === 2;
  
  // Número de capítulos por livro
  const capitulosPorLivro: Record<string, number> = {
    'Gênesis': 50, 'Êxodo': 40, 'Levítico': 27, 'Números': 36, 'Deuteronômio': 34, 'Josué': 24, 'Juízes': 21, 'Rute': 4,
    '1 Samuel': 31, '2 Samuel': 24, '1 Reis': 22, '2 Reis': 25, '1 Crônicas': 29, '2 Crônicas': 36, 'Esdras': 10, 'Neemias': 13, 'Ester': 10, 'Jó': 42, 'Salmos': 150, 'Provérbios': 31, 'Eclesiastes': 12, 'Cânticos': 8, 'Isaías': 66, 'Jeremias': 52, 'Lamentações': 5, 'Ezequiel': 48, 'Daniel': 12, 'Oseias': 14, 'Joel': 3, 'Amós': 9, 'Obadias': 1, 'Jonas': 4, 'Miquéias': 7, 'Naum': 3, 'Habacuque': 3, 'Sofonias': 3, 'Ageu': 2, 'Zacarias': 14, 'Malaquias': 4,
    'Mateus': 28, 'Marcos': 16, 'Lucas': 24, 'João': 21, 'Atos': 28, 'Romanos': 16, '1 Coríntios': 16, '2 Coríntios': 13, 'Gálatas': 6, 'Efésios': 6, 'Filipenses': 4, 'Colossenses': 4, '1 Tessalonicenses': 5, '2 Tessalonicenses': 3, '1 Timóteo': 6, '2 Timóteo': 4, 'Tito': 3, 'Filemom': 1, 'Hebreus': 13, 'Tiago': 5, '1 Pedro': 5, '2 Pedro': 3, '1 João': 5, '2 João': 1, '3 João': 1, 'Judas': 1, 'Apocalipse': 22
  };

  // Capítulos válidos para o livro selecionado
  const capitulos = Array.from({ length: capitulosPorLivro[livro] || 1 }, (_, i) => i + 1);

  return (
    <div className={`min-h-screen w-full flex flex-col items-center px-2 pt-6 overflow-y-auto relative ${darkMode ? 'bg-[#23232b]' : whiteMode ? 'bg-white' : 'bg-[#fdf6e3]'} pb-28` }>
      {/* Botão de tema */}
      <div className="absolute top-4 right-4 z-30 flex gap-2">
        <button
          className="bg-white/70 hover:bg-white/90 rounded-full p-2 shadow transition-opacity opacity-80 hover:opacity-100"
          title="Alternar tema de leitura"
          onClick={() => setThemeMode(m => (m + 1) % 3)}
          aria-label="Alternar tema de leitura"
        >
          {themeMode === 0 && (
            <svg width="22" height="22" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          )}
          {themeMode === 1 && (
            <svg width="22" height="22" fill="none" stroke="#23232b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>
          )}
          {themeMode === 2 && (
            <svg width="22" height="22" fill="none" stroke="#23232b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          )}
        </button>
      </div>

      {/* Seletores de livro e capítulo */}
      <div className="flex gap-3 w-full max-w-md mb-2 px-2 overflow-x-auto mt-14">
        <select
          className={`flex-1 min-w-0 rounded-2xl border-2 text-xl font-semibold p-3 focus:outline-none shadow-sm ${darkMode ? 'bg-[#2d2d35] border-[#23232b] text-white' : whiteMode ? 'bg-white border-gray-200 text-[#23232b]' : 'bg-white border-yellow-200 text-[#23232b] focus:ring-2 focus:ring-yellow-200'}`}
          value={livro}
          onChange={e => setLivro(e.target.value)}
        >
          {livros.map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        <select
          className={`w-20 min-w-0 rounded-2xl border-2 text-xl font-semibold p-3 focus:outline-none shadow-sm ${darkMode ? 'bg-[#2d2d35] border-[#23232b] text-white' : whiteMode ? 'bg-white border-gray-200 text-[#23232b]' : 'bg-white border-yellow-200 text-[#23232b] focus:ring-2 focus:ring-yellow-200'}`}
          value={capitulo}
          onChange={e => setCapitulo(Number(e.target.value))}
        >
          {capitulos.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className={`w-full max-w-md border-b mb-6 ${darkMode ? 'border-[#23232b]' : whiteMode ? 'border-gray-200' : 'border-yellow-100'}`} />

      {/* Área de conteúdo da bíblia */}
      <div className="flex flex-col gap-3 px-6 sm:px-0 pb-28 w-full max-w-4xl">
        <h2 className={`text-2xl font-bold mb-4 ml-2 ${darkMode ? 'text-white' : whiteMode ? 'text-[#23232b]' : 'text-[#23232b]'}`}>
          {livro} {capitulo}
        </h2>
        
        {/* Versículos de exemplo */}
        <div className={`flex items-start gap-2 rounded-xl p-3 mb-1 shadow-sm border ${darkMode ? 'bg-[#2d2d35] border-[#23232b]' : whiteMode ? 'bg-white border-gray-200' : 'bg-[#fffbea] border-yellow-100'}`}>
          <span className="text-[#a084e8] font-bold select-none mt-1" style={{minWidth: 18}}>1</span>
          <span className={`text-xl font-serif leading-relaxed ${darkMode ? 'text-white' : 'text-[#23232b]'}`} style={{wordBreak: 'break-word'}}>
            O Senhor é o meu pastor, nada me faltará.
          </span>
        </div>

        <div className={`flex items-start gap-2 rounded-xl p-3 mb-1 shadow-sm border ${darkMode ? 'bg-[#2d2d35] border-[#23232b]' : whiteMode ? 'bg-white border-gray-200' : 'bg-[#fffbea] border-yellow-100'}`}>
          <span className="text-[#a084e8] font-bold select-none mt-1" style={{minWidth: 18}}>2</span>
          <span className={`text-xl font-serif leading-relaxed ${darkMode ? 'text-white' : 'text-[#23232b]'}`} style={{wordBreak: 'break-word'}}>
            Ele me faz repousar em pastos verdejantes e me conduz às águas tranquilas.
          </span>
        </div>

        <div className={`flex items-start gap-2 rounded-xl p-3 mb-1 shadow-sm border ${darkMode ? 'bg-[#2d2d35] border-[#23232b]' : whiteMode ? 'bg-white border-gray-200' : 'bg-[#fffbea] border-yellow-100'}`}>
          <span className="text-[#a084e8] font-bold select-none mt-1" style={{minWidth: 18}}>3</span>
          <span className={`text-xl font-serif leading-relaxed ${darkMode ? 'text-white' : 'text-[#23232b]'}`} style={{wordBreak: 'break-word'}}>
            Ele restaura a minha alma e me guia pelos caminhos da justiça por amor do seu nome.
          </span>
        </div>
      </div>
    </div>
  );
}