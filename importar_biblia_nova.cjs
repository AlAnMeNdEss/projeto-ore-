const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://fidiulbnuucqfckozbrv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZGl1bGJudXVjcWZja296YnJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTA1ODksImV4cCI6MjA2NjI4NjU4OX0.ICE5GMLkDu7vVmHS44MOihIPr10w_z4VrJe7qfVZdrQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function importarBiblia() {
  try {
    console.log('📖 Lendo arquivo JSON...');
    const bibliaData = JSON.parse(fs.readFileSync('./biblia_completa.json', 'utf8'));
    
    console.log(`✅ ${bibliaData.length} livros encontrados`);
    
    let totalInseridos = 0;
    
    for (const livro of bibliaData) {
      console.log(`📚 Processando ${livro.name}...`);
      
      for (let cap = 0; cap < livro.chapters.length; cap++) {
        const capitulo = cap + 1;
        const versiculos = livro.chapters[cap];
        
        const dados = versiculos.map((texto, index) => ({
          livro: livro.name,
          capitulo: capitulo,
          versiculo: (index + 1).toString(),
          texto: texto
        }));
        
        const { error } = await supabase
          .from('versiculos_biblia')
          .insert(dados);
        
        if (error) {
          console.error('❌ Erro:', error);
          return;
        }
        
        totalInseridos += dados.length;
        console.log(`✅ ${dados.length} versículos inseridos`);
      }
    }
    
    console.log(`🎉 Total: ${totalInseridos} versículos inseridos!`);
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

importarBiblia(); 