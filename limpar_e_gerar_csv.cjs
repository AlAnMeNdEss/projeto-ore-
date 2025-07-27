const fs = require('fs');

try {
  console.log('Lendo e limpando arquivo JSON...');
  
  // Ler o arquivo como string
  let conteudo = fs.readFileSync('./public/pt_nvi.json', 'utf8');
  
  // Tentar limpar caracteres problemáticos
  console.log('Limpando caracteres inválidos...');
  
  // Remover possíveis BOM (Byte Order Mark)
  conteudo = conteudo.replace(/^\uFEFF/, '');
  
  // Tentar corrigir aspas duplas extras
  conteudo = conteudo.replace(/""/g, '"');
  
  // Tentar fazer parse do JSON limpo
  console.log('Fazendo parse do JSON limpo...');
  const data = JSON.parse(conteudo);
  
  console.log('JSON processado com sucesso!');
  console.log('Número de livros:', data.length);
  
  const linhas = ['livro,capitulo,versiculo,texto'];
  let contador = 0;
  
  // Processar apenas os primeiros 100 versículos para teste
  for (const livro of data) {
    const nomeLivro = livro.name || livro.book; // tentar ambos os campos
    if (!livro.chapters) continue;
    
    for (const [capitulo, versiculos] of Object.entries(livro.chapters)) {
      for (const [versiculo, texto] of Object.entries(versiculos)) {
        if (typeof texto !== 'string') continue;
        
        const textoLimpo = texto.replace(/"/g, '""').replace(/\n/g, ' ').trim();
        linhas.push(`"${nomeLivro}",${capitulo},${versiculo},"${textoLimpo}"`);
        contador++;
        
        // Parar após 100 versículos para teste
        if (contador >= 100) break;
      }
      if (contador >= 100) break;
    }
    if (contador >= 100) break;
  }
  
  console.log('Gerando CSV...');
  fs.writeFileSync('versiculos_biblia.csv', linhas.join('\n'), 'utf8');
  console.log('CSV gerado com sucesso!');
  console.log('Versículos processados:', contador);
  
} catch (error) {
  console.error('Erro:', error.message);
  
  // Se ainda der erro, vamos tentar uma abordagem mais agressiva
  console.log('\nTentando abordagem alternativa...');
  try {
    let conteudo = fs.readFileSync('./public/pt_nvi.json', 'utf8');
    
    // Remover caracteres problemáticos mais agressivamente
    conteudo = conteudo.replace(/[^\x20-\x7E]/g, ''); // manter apenas ASCII imprimível
    conteudo = conteudo.replace(/""+/g, '"'); // corrigir aspas múltiplas
    
    const data = JSON.parse(conteudo);
    console.log('JSON processado com abordagem alternativa!');
    
    // Gerar CSV com abordagem alternativa
    const linhas = ['livro,capitulo,versiculo,texto'];
    let contador = 0;
    
    for (const livro of data) {
      const nomeLivro = livro.name || livro.book || 'Desconhecido';
      if (!livro.chapters) continue;
      
      for (const [capitulo, versiculos] of Object.entries(livro.chapters)) {
        for (const [versiculo, texto] of Object.entries(versiculos)) {
          if (typeof texto !== 'string') continue;
          
          const textoLimpo = texto.replace(/"/g, '""').replace(/\n/g, ' ').trim();
          linhas.push(`"${nomeLivro}",${capitulo},${versiculo},"${textoLimpo}"`);
          contador++;
          
          if (contador >= 50) break; // apenas 50 para teste
        }
        if (contador >= 50) break;
      }
      if (contador >= 50) break;
    }
    
    fs.writeFileSync('versiculos_biblia_alt.csv', linhas.join('\n'), 'utf8');
    console.log('CSV alternativo gerado com sucesso!');
    console.log('Versículos processados:', contador);
    
  } catch (error2) {
    console.error('Erro na abordagem alternativa:', error2.message);
  }
} 