const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://fidiulbnuucqfckozbrv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZGl1bGJudXVjcWZja296YnJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTA1ODksImV4cCI6MjA2NjI4NjU4OX0.ICE5GMLkDu7vVmHS44MOihIPr10w_z4VrJe7qfVZdrQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function importarRapido() {
  try {
    console.log('🚀 Importação rápida iniciada...');
    
    // Limpar tabela primeiro
    console.log('🧹 Limpando tabela...');
    await supabase.from('versiculos_biblia').delete().neq('id', 0);
    
    // Ler CSV
    const csvContent = fs.readFileSync('almeida_rc (1).csv', 'utf8');
    const linhas = csvContent.split('\n');
    
    console.log(`📊 Processando ${linhas.length} linhas...`);
    
    // Pular cabeçalho e processar
    const versiculos = [];
    for (let i = 1; i < linhas.length; i++) {
      const linha = linhas[i].trim();
      if (!linha) continue;
      
      const campos = linha.split(',');
      if (campos.length >= 4) {
        versiculos.push({
          livro: campos[0].replace(/"/g, ''),
          capitulo: parseInt(campos[1]) || 1,
          versiculo: campos[2].replace(/"/g, ''),
          texto: campos[3].replace(/"/g, '')
        });
      }
    }
    
    console.log(`📖 ${versiculos.length} versículos prontos para importar`);
    
    // Importar em lotes grandes
    const loteSize = 2000;
    let total = 0;
    
    for (let i = 0; i < versiculos.length; i += loteSize) {
      const lote = versiculos.slice(i, i + loteSize);
      console.log(`📦 Lote ${Math.floor(i/loteSize) + 1}/${Math.ceil(versiculos.length/loteSize)}`);
      
      await supabase.from('versiculos_biblia').insert(lote);
      total += lote.length;
    }
    
    console.log(`✅ Concluído! ${total} versículos importados`);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

importarRapido(); 