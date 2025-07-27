const fs = require('fs');

try {
  console.log('Analisando arquivo JSON corrompido...');
  
  let conteudo = fs.readFileSync('./public/pt_nvi.json', 'utf8');
  console.log('Tamanho do arquivo:', conteudo.length, 'caracteres');
  
  // Mostrar contexto do erro na posição 7286
  const posicao = 7286;
  console.log('\nContexto do erro na posição', posicao, ':');
  console.log('Antes:', conteudo.substring(posicao - 100, posicao));
  console.log('ERRO AQUI >>>', conteudo.substring(posicao, posicao + 50));
  console.log('Depois:', conteudo.substring(posicao + 50, posicao + 150));
  
  // Tentar corrigir problemas comuns
  console.log('\nTentando corrigir problemas...');
  
  // 1. Remover BOM
  conteudo = conteudo.replace(/^\uFEFF/, '');
  
  // 2. Corrigir aspas duplas extras
  conteudo = conteudo.replace(/""+/g, '"');
  
  // 3. Corrigir vírgulas faltando ou extras
  conteudo = conteudo.replace(/"\s*}\s*"/g, '", "');
  conteudo = conteudo.replace(/"\s*,\s*,\s*"/g, '", "');
  
  // 4. Corrigir chaves malformadas
  conteudo = conteudo.replace(/"\s*}\s*{/g, '", {');
  conteudo = conteudo.replace(/}\s*{\s*"/g, '}, "');
  
  // 5. Remover caracteres de controle
  conteudo = conteudo.replace(/[\x00-\x1F\x7F]/g, '');
  
  console.log('Tentando parse do JSON corrigido...');
  const data = JSON.parse(conteudo);
  
  console.log('SUCESSO! JSON corrigido e processado.');
  console.log('Número de livros:', data.length);
  
  // Gerar CSV com os primeiros 50 versículos
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
        
        if (contador >= 50) break;
      }
      if (contador >= 50) break;
    }
    if (contador >= 50) break;
  }
  
  fs.writeFileSync('versiculos_biblia_corrigido.csv', linhas.join('\n'), 'utf8');
  console.log('CSV gerado com sucesso!');
  console.log('Versículos processados:', contador);
  
} catch (error) {
  console.error('Erro:', error.message);
  
  // Se ainda der erro, vamos tentar uma abordagem mais radical
  console.log('\nTentando abordagem mais radical...');
  try {
    let conteudo = fs.readFileSync('./public/pt_nvi.json', 'utf8');
    
    // Tentar extrair apenas o primeiro livro para teste
    const match = conteudo.match(/\[.*?"abbrev".*?"chapters".*?\}/);
    if (match) {
      console.log('Extraindo primeiro livro...');
      const primeiroLivro = match[0] + ']';
      
      // Tentar corrigir o primeiro livro
      let livroCorrigido = primeiroLivro
        .replace(/""+/g, '"')
        .replace(/[\x00-\x1F\x7F]/g, '')
        .replace(/"\s*}\s*"/g, '", "');
      
      const data = JSON.parse(livroCorrigido);
      console.log('Primeiro livro processado com sucesso!');
      
      // Gerar CSV apenas com o primeiro livro
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
            
            if (contador >= 20) break; // apenas 20 para teste
          }
          if (contador >= 20) break;
        }
        if (contador >= 20) break;
      }
      
      fs.writeFileSync('versiculos_primeiro_livro.csv', linhas.join('\n'), 'utf8');
      console.log('CSV do primeiro livro gerado com sucesso!');
      console.log('Versículos processados:', contador);
    } else {
      console.log('Não foi possível extrair o primeiro livro.');
    }
    
  } catch (error2) {
    console.error('Erro na abordagem radical:', error2.message);
    console.log('\nO arquivo JSON está muito corrompido. Recomendo:');
    console.log('1. Baixar novamente o arquivo pt_nvi.json');
    console.log('2. Ou usar o script original importar_biblia_supabase.js que pode funcionar melhor');
  }
} 