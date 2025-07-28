const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fidiulbnuucqfckozbrv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZGl1bGJudXVjcWZja296YnJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTA1ODksImV4cCI6MjA2NjI4NjU4OX0.ICE5GMLkDu7vVmHS44MOihIPr10w_z4VrJe7qfVZdrQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testarBuscaMiqueias() {
  try {
    console.log('🔍 Testando busca exata do componente para Miqueias...');
    
    const livro = 'Miqueias';
    const capitulo = 1;
    
    console.log(`📖 Buscando: ${livro} capítulo ${capitulo}`);
    
    const { data, error } = await supabase
      .from('versiculos_biblia')
      .select('*')
      .eq('livro', livro)
      .eq('capitulo', capitulo)
      .order('versiculo', { ascending: true });

    if (error) {
      console.error('❌ Erro na busca:', error);
      return;
    }

    console.log(`📊 Resultados encontrados: ${data?.length || 0}`);
    
    if (data && data.length > 0) {
      console.log('✅ Busca bem-sucedida!');
      console.log('📝 Primeiros 3 versículos:');
      data.slice(0, 3).forEach(v => {
        console.log(`  ${v.versiculo}. ${v.texto.substring(0, 80)}...`);
      });
    } else {
      console.log('❌ Nenhum resultado encontrado');
      
      // Verificar se o livro existe com nome diferente
      console.log('🔍 Verificando variações do nome...');
      const { data: variacoes } = await supabase
        .from('versiculos_biblia')
        .select('livro')
        .ilike('livro', '%miqueias%');
      
      if (variacoes && variacoes.length > 0) {
        console.log('📋 Variações encontradas:');
        [...new Set(variacoes.map(v => v.livro))].forEach(nome => {
          console.log(`  - "${nome}"`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

testarBuscaMiqueias(); 