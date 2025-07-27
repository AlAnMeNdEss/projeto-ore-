const fs = require('fs');

try {
  console.log('Verificando arquivo JSON...');
  
  // Ler apenas os primeiros 1000 caracteres para verificar
  const conteudo = fs.readFileSync('./public/pt_nvi.json', 'utf8');
  console.log('Tamanho do arquivo:', conteudo.length, 'caracteres');
  console.log('Primeiros 200 caracteres:');
  console.log(conteudo.substring(0, 200));
  
  // Tentar fazer parse do JSON
  console.log('\nTentando fazer parse do JSON...');
  const data = JSON.parse(conteudo);
  console.log('JSON válido!');
  console.log('Tipo do dado:', typeof data);
  console.log('É um array?', Array.isArray(data));
  if (Array.isArray(data)) {
    console.log('Número de elementos:', data.length);
    if (data.length > 0) {
      console.log('Primeiro elemento:', Object.keys(data[0]));
    }
  }
  
} catch (error) {
  console.error('Erro ao processar JSON:', error.message);
  
  // Tentar encontrar onde está o problema
  const conteudo = fs.readFileSync('./public/pt_nvi.json', 'utf8');
  const posicao = parseInt(error.message.match(/position (\d+)/)?.[1] || '0');
  console.log('\nProblema encontrado na posição:', posicao);
  console.log('Caracteres ao redor do erro:');
  console.log(conteudo.substring(Math.max(0, posicao - 50), posicao + 50));
} 