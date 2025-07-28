const fs = require('fs');

function verificarCSV() {
  try {
    console.log('🔍 Verificando estrutura do CSV...');
    
    const csvFile = 'almeida_rc (1).csv';
    if (!fs.existsSync(csvFile)) {
      console.log(`❌ Arquivo ${csvFile} não encontrado!`);
      return;
    }
    
    // Ler as primeiras linhas
    const csvContent = fs.readFileSync(csvFile, 'utf8');
    const linhas = csvContent.split('\n');
    
    console.log(`📊 Total de linhas: ${linhas.length}`);
    console.log('\n📋 Primeiras 5 linhas:');
    
    for (let i = 0; i < Math.min(5, linhas.length); i++) {
      console.log(`Linha ${i + 1}: ${linhas[i].substring(0, 200)}...`);
    }
    
    // Verificar cabeçalho
    if (linhas.length > 0) {
      const cabecalho = linhas[0];
      const campos = cabecalho.split(',');
      console.log('\n📋 Campos do cabeçalho:');
      campos.forEach((campo, index) => {
        console.log(`${index + 1}: "${campo.trim()}"`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

verificarCSV(); 