const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fidiulbnuucqfckozbrv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZGl1bGJudXVjcWZja296YnJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTA1ODksImV4cCI6MjA2NjI4NjU4OX0.ICE5GMLkDu7vVmHS44MOihIPr10w_z4VrJe7qfVZdrQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testarMiqueias() {
  try {
    console.log('🔍 Testando livro de Miqueias...');
    
    // Teste 1: Verificar se existe
    const { data: todos, error: errorTodos } = await supabase
      .from('versiculos_biblia')
      .select('*')
      .eq('livro', 'Miqueias');
    
    if (errorTodos) {
      console.error('❌ Erro ao buscar Miqueias:', errorTodos);
      return;
    }
    
    console.log(`📊 Total de versículos de Miqueias: ${todos?.length || 0}`);
    
    if (todos && todos.length > 0) {
      console.log('✅ Miqueias encontrado na base de dados');
      
      // Teste 2: Verificar capítulo 1
      const { data: cap1, error: errorCap1 } = await supabase
        .from('versiculos_biblia')
        .select('*')
        .eq('livro', 'Miqueias')
        .eq('capitulo', 1)
        .order('versiculo', { ascending: true });
      
      if (errorCap1) {
        console.error('❌ Erro ao buscar capítulo 1:', errorCap1);
        return;
      }
      
      console.log(`📖 Capítulo 1: ${cap1?.length || 0} versículos`);
      
      if (cap1 && cap1.length > 0) {
        console.log('✅ Capítulo 1 encontrado');
        console.log('📝 Primeiros 3 versículos:');
        cap1.slice(0, 3).forEach(v => {
          console.log(`  ${v.versiculo}. ${v.texto.substring(0, 80)}...`);
        });
      } else {
        console.log('❌ Capítulo 1 não encontrado');
      }
      
      // Teste 3: Verificar todos os capítulos
      const capitulos = [...new Set(todos.map(v => v.capitulo))].sort((a, b) => a - b);
      console.log(`📚 Capítulos disponíveis: ${capitulos.join(', ')}`);
      
    } else {
      console.log('❌ Miqueias não encontrado na base de dados');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

testarMiqueias(); 