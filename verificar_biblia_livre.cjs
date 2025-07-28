const fs = require('fs');

function verificarBibliaLivre() {
  try {
    console.log('🔍 Verificando estrutura do biblialivre.json...');
    
    if (!fs.existsSync('biblialivre.json')) {
      console.log('❌ Arquivo biblialivre.json não encontrado!');
      return;
    }
    
    // Ler o arquivo JSON
    const bibliaData = JSON.parse(fs.readFileSync('biblialivre.json', 'utf8'));
    
    console.log(`📊 Total de itens: ${bibliaData.length}`);
    
    // Verificar os primeiros itens
    console.log('\n📋 Primeiros 3 itens:');
    for (let i = 0; i < Math.min(3, bibliaData.length); i++) {
      const item = bibliaData[i];
      console.log(`\nItem ${i + 1}:`);
      console.log('- Chaves:', Object.keys(item));
      console.log('- Nome:', item.name);
      console.log('- Capítulos:', item.chapters ? item.chapters.length : 'undefined');
      if (item.chapters && item.chapters.length > 0) {
        console.log('- Primeiro capítulo versículos:', item.chapters[0].length);
      }
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

verificarBibliaLivre(); 