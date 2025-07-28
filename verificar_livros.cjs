const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fidiulbnuucqfckozbrv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZGl1bGJudXVjcWZja296YnJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTA1ODksImV4cCI6MjA2NjI4NjU4OX0.ICE5GMLkDu7vVmHS44MOihIPr10w_z4VrJe7qfVZdrQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function verificarLivros() {
  try {
    console.log('🔍 Verificando todos os livros disponíveis...');
    
    const { data, error } = await supabase
      .from('versiculos_biblia')
      .select('livro')
      .order('livro');
    
    if (error) {
      console.error('❌ Erro:', error);
      return;
    }
    
    const livrosUnicos = [...new Set(data.map(v => v.livro))].sort();
    
    console.log(`📚 Total de livros únicos: ${livrosUnicos.length}`);
    console.log('\n📖 Lista completa de livros:');
    
    livrosUnicos.forEach((livro, index) => {
      console.log(`${index + 1}. "${livro}"`);
    });
    
    // Verificar especificamente Miqueias e Cânticos
    console.log('\n🔍 Verificando livros específicos:');
    
    const livrosParaVerificar = ['Miqueias', 'Cânticos', 'Cantares', 'Cantares de Salomão'];
    
    for (const livro of livrosParaVerificar) {
      const { data: resultado } = await supabase
        .from('versiculos_biblia')
        .select('*')
        .eq('livro', livro)
        .limit(1);
      
      if (resultado && resultado.length > 0) {
        console.log(`✅ "${livro}" - ENCONTRADO (${resultado.length} versículos)`);
      } else {
        console.log(`❌ "${livro}" - NÃO ENCONTRADO`);
      }
    }
    
    // Verificar variações com busca parcial
    console.log('\n🔍 Verificando variações de Miqueias e Cânticos:');
    
    const { data: miqueiasVariacoes } = await supabase
      .from('versiculos_biblia')
      .select('livro')
      .ilike('livro', '%miqueias%');
    
    const { data: canticosVariacoes } = await supabase
      .from('versiculos_biblia')
      .select('livro')
      .ilike('livro', '%cantico%');
    
    if (miqueiasVariacoes && miqueiasVariacoes.length > 0) {
      const variacoes = [...new Set(miqueiasVariacoes.map(v => v.livro))];
      console.log(`📋 Variações de Miqueias: ${variacoes.join(', ')}`);
    }
    
    if (canticosVariacoes && canticosVariacoes.length > 0) {
      const variacoes = [...new Set(canticosVariacoes.map(v => v.livro))];
      console.log(`📋 Variações de Cânticos: ${variacoes.join(', ')}`);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

verificarLivros(); 