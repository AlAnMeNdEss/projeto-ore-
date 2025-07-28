const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fidiulbnuucqfckozbrv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZGl1bGJudXVjcWZja296YnJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTA1ODksImV4cCI6MjA2NjI4NjU4OX0.ICE5GMLkDu7vVmHS44MOihIPr10w_z4VrJe7qfVZdrQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function verificarDetalhado() {
  try {
    console.log('🔍 Verificação detalhada da base de dados...');
    
    // Verificar total de versículos
    const { count: total } = await supabase
      .from('versiculos_biblia')
      .select('*', { count: 'exact', head: true });
    
    console.log(`📊 Total de versículos na base: ${total}`);
    
    // Verificar livros únicos
    const { data: livros } = await supabase
      .from('versiculos_biblia')
      .select('livro');
    
    const livrosUnicos = [...new Set(livros.map(v => v.livro))].sort();
    console.log(`📚 Total de livros únicos: ${livrosUnicos.length}`);
    
    // Mostrar todos os livros
    console.log('\n📖 Todos os livros:');
    livrosUnicos.forEach((livro, index) => {
      console.log(`${index + 1}. "${livro}"`);
    });
    
    // Verificar Miqueias especificamente
    console.log('\n🔍 Verificando Miqueias:');
    const { data: miqueias, count: countMiqueias } = await supabase
      .from('versiculos_biblia')
      .select('*', { count: 'exact' })
      .eq('livro', 'Miqueias');
    
    console.log(`📊 Miqueias: ${countMiqueias} versículos`);
    
    if (miqueias && miqueias.length > 0) {
      const capitulos = [...new Set(miqueias.map(v => v.capitulo))].sort((a, b) => a - b);
      console.log(`📖 Capítulos de Miqueias: ${capitulos.join(', ')}`);
      
      // Mostrar primeiro versículo
      console.log('📝 Primeiro versículo:');
      console.log(`  ${miqueias[0].versiculo}. ${miqueias[0].texto.substring(0, 100)}...`);
    }
    
    // Verificar Cantares especificamente
    console.log('\n🔍 Verificando Cantares:');
    const { data: cantares, count: countCantares } = await supabase
      .from('versiculos_biblia')
      .select('*', { count: 'exact' })
      .eq('livro', 'Cantares');
    
    console.log(`📊 Cantares: ${countCantares} versículos`);
    
    if (cantares && cantares.length > 0) {
      const capitulos = [...new Set(cantares.map(v => v.capitulo))].sort((a, b) => a - b);
      console.log(`📖 Capítulos de Cantares: ${capitulos.join(', ')}`);
      
      // Mostrar primeiro versículo
      console.log('📝 Primeiro versículo:');
      console.log(`  ${cantares[0].versiculo}. ${cantares[0].texto.substring(0, 100)}...`);
    }
    
    // Testar busca específica
    console.log('\n🔍 Testando busca específica:');
    const { data: buscaMiqueias } = await supabase
      .from('versiculos_biblia')
      .select('*')
      .eq('livro', 'Miqueias')
      .eq('capitulo', 1)
      .order('versiculo', { ascending: true });
    
    console.log(`📊 Miqueias capítulo 1: ${buscaMiqueias?.length || 0} versículos`);
    
    if (buscaMiqueias && buscaMiqueias.length > 0) {
      console.log('✅ Busca bem-sucedida!');
      console.log('📝 Primeiros 3 versículos:');
      buscaMiqueias.slice(0, 3).forEach(v => {
        console.log(`  ${v.versiculo}. ${v.texto.substring(0, 80)}...`);
      });
    } else {
      console.log('❌ Nenhum resultado encontrado');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

verificarDetalhado(); 