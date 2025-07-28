const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://fidiulbnuucqfckozbrv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZGl1bGJudXVjcWZja296YnJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTA1ODksImV4cCI6MjA2NjI4NjU4OX0.ICE5GMLkDu7vVmHS44MOihIPr10w_z4VrJe7qfVZdrQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function importarBibliaLivreCorrigido() {
  try {
    console.log('📖 Importando Bíblia Livre...');
    
    // Verificar se o arquivo existe
    if (!fs.existsSync('biblialivre.json')) {
      console.log('❌ Arquivo biblialivre.json não encontrado!');
      return;
    }
    
    // Ler o arquivo JSON
    console.log('📖 Lendo arquivo JSON...');
    const bibliaData = JSON.parse(fs.readFileSync('biblialivre.json', 'utf8'));
    
    console.log(`✅ ${bibliaData.length} itens encontrados`);
    
    let totalInseridos = 0;
    
    // Processar cada livro (pular o primeiro item que é metadata)
    for (let i = 1; i < bibliaData.length; i++) {
      const livro = bibliaData[i];
      
      if (!livro.nome || !livro.capitulos) {
        console.log(`⚠️ Pulando item ${i} - dados incompletos`);
        continue;
      }
      
      console.log(`📚 Processando ${livro.nome}...`);
      
      for (let cap = 0; cap < livro.capitulos.length; cap++) {
        const capitulo = cap + 1;
        const versiculos = livro.capitulos[cap];
        
        if (!Array.isArray(versiculos)) {
          console.log(`⚠️ Capítulo ${capitulo} não é array, pulando`);
          continue;
        }
        
        const dados = versiculos.map((texto, index) => ({
          livro: livro.nome,
          capitulo: capitulo,
          versiculo: (index + 1).toString(),
          texto: texto,
          traducao: 'biblia_livre'
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

importarBibliaLivreCorrigido(); 