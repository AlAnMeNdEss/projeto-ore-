const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fidiulbnuucqfckozbrv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZGl1bGJudXVjcWZja296YnJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTA1ODksImV4cCI6MjA2NjI4NjU4OX0.ICE5GMLkDu7vVmHS44MOihIPr10w_z4VrJe7qfVZdrQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verificarSimples() {
  try {
    console.log('🔍 Verificando dados...');
    
    // Verificar alguns registros
    const { data, error } = await supabase
      .from('versiculos_biblia')
      .select('*')
      .limit(5);
    
    if (error) {
      console.error('❌ Erro:', error);
      return;
    }
    
    console.log('📊 Primeiros 5 registros:');
    data.forEach((item, index) => {
      console.log(`${index + 1}. Livro: "${item.livro}", Capítulo: ${item.capitulo}, Versículo: ${item.versiculo}`);
    });
    
    // Verificar Gênesis especificamente
    const { data: genesis, error: genesisError } = await supabase
      .from('versiculos_biblia')
      .select('*')
      .eq('livro', 'Gênesis')
      .limit(3);
    
    if (genesisError) {
      console.error('❌ Erro ao buscar Gênesis:', genesisError);
    } else {
      console.log('\n📖 Gênesis encontrados:', genesis.length);
      genesis.forEach(item => {
        console.log(`- ${item.livro} ${item.capitulo}:${item.versiculo}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

verificarSimples(); 