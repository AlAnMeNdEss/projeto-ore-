const fs = require('fs');

try {
  console.log('Lendo arquivo JSON...');
  const data = JSON.parse(fs.readFileSync('./public/pt_nvi.json', 'utf8'));
  console.log('Arquivo lido com sucesso!');
  console.log('Número de livros:', data.length);
  
  const linhas = ['livro,capitulo,versiculo,texto'];
  let contador = 0;
  
  // Pegar apenas os primeiros 10 versículos para teste
  for (const livro of data) {
    const nomeLivro = livro.name;
    for (const [capitulo, versiculos] of Object.entries(livro.chapters)) {
      for (const [versiculo, texto] of Object.entries(versiculos)) {
        const textoLimpo = texto.replace(/"/g, '""').replace(/\n/g, ' ');
        linhas.push(`"${nomeLivro}",${capitulo},${versiculo},"${textoLimpo}"`);
        contador++;
        
        // Parar após 10 versículos para teste
        if (contador >= 10) break;
      }
      if (contador >= 10) break;
    }
    if (contador >= 10) break;
  }
  
  console.log('Gerando CSV de teste...');
  fs.writeFileSync('teste_versiculos.csv', linhas.join('\n'), 'utf8');
  console.log('CSV de teste gerado com sucesso!');
  console.log('Versículos processados:', contador);
  
} catch (error) {
  console.error('Erro:', error.message);
} 