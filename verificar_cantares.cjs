const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fidiulbnuucqfckozbrv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZGl1bGJudXVjcWZja296YnJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTA1ODksImV4cCI6MjA2NjI4NjU4OX0.ICE5GMLkDu7vVmHS44MOihIPr10w_z4VrJe7qfVZdrQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function verificarCantares() {
  try {
    console.log('🔍 Verificando Cantares/Cânticos...');
    
    // Testar diferentes variações
    const variacoes = ['Cantares', 'Cânticos', 'Cantares de Salomão'];
    
    for (const nome of variacoes) {
      const { data, count } = await supabase
        .from('versiculos_biblia')
        .select('*', { count: 'exact' })
        .eq('livro', nome);
      
      console.log(`📊 "${nome}": ${count || 0} versículos`);
      
      if (data && data.length > 0) {
        const capitulos = [...new Set(data.map(v => v.capitulo))].sort((a, b) => a - b);
        console.log(`  📖 Capítulos: ${capitulos.join(', ')}`);
        console.log(`  📝 Primeiro versículo: ${data[0].versiculo}. ${data[0].texto.substring(0, 80)}...`);
      }
    }
    
    // Verificar todos os livros que contêm "cant" no nome
    const { data: todos } = await supabase
      .from('versiculos_biblia')
      .select('livro')
      .ilike('livro', '%cant%');
    
    if (todos && todos.length > 0) {
      const livrosComCant = [...new Set(todos.map(v => v.livro))];
      console.log(`\n📋 Livros com "cant" no nome: ${livrosComCant.map(l => `"${l}"`).join(', ')}`);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

verificarCantares(); 