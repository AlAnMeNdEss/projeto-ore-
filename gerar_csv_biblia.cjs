const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./public/pt_nvi.json', 'utf8'));
const linhas = ['livro,capitulo,versiculo,texto'];

for (const livro of data) {
  const nomeLivro = livro.name;
  for (const [capitulo, versiculos] of Object.entries(livro.chapters)) {
    for (const [versiculo, texto] of Object.entries(versiculos)) {
      // Escapa aspas duplas no texto
      const textoLimpo = texto.replace(/"/g, '""').replace(/\n/g, ' ');
      linhas.push(`"${nomeLivro}",${capitulo},${versiculo},"${textoLimpo}"`);
    }
  }
}

fs.writeFileSync('versiculos_biblia.csv', linhas.join('\n'), 'utf8');
console.log('CSV gerado com sucesso!'); 