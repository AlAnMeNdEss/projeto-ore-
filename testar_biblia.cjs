const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fidiulbnuucqfckozbrv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZGl1bGJudXVjcWZja296YnJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTA1ODksImV4cCI6MjA2NjI4NjU4OX0.ICE5GMLkDu7vVmHS44MOihIPr10w_z4VrJe7qfVZdrQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testarBiblia() {
  try {
    console.log('🔍 Testando busca por Gênesis capítulo 1...');
    
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

    console.log('📊 Resultados encontrados:', data.length);
    console.log('📖 Versículos:', data);
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

testarBiblia(); 