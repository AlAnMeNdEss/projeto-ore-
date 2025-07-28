const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fidiulbnuucqfckozbrv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZGl1bGJudXVjcWZja296YnJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTA1ODksImV4cCI6MjA2NjI4NjU4OX0.ICE5GMLkDu7vVmHS44MOihIPr10w_z4VrJe7qfVZdrQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testarGenesis() {
  try {
    console.log('🔍 Testando Gênesis capítulo 1...');
    
    const { data, error } = await supabase
      .from('versiculos_biblia')
      .select('*')
      .eq('livro', 'Gênesis')
      .eq('capitulo', 1)
      .order('versiculo', { ascending: true });
    
    if (error) {
      console.error('❌ Erro:', error);
      return;
    }
    
    console.log(`📊 Total de versículos encontrados: ${data.length}`);
    console.log('📖 Versículos em ordem:');
    
    data.forEach((versiculo, index) => {
      console.log(`${index + 1}. ${versiculo.livro} ${versiculo.capitulo}:${versiculo.versiculo} - ${versiculo.texto.substring(0, 50)}...`);
    });
    
    // Verificar se temos todos os 31 versículos
    if (data.length === 31) {
      console.log('✅ Gênesis capítulo 1 completo encontrado!');
    } else {
      console.log(`⚠️ Faltam versículos. Esperado: 31, Encontrado: ${data.length}`);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

testarGenesis(); 