import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fidiulbnuucqfckozbrv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZGl1bGJudXVjcWZja296YnJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTA1ODksImV4cCI6MjA2NjI4NjU4OX0.ICE5GMLkDu7vVmHS44MOihIPr10w_z4VrJe7qfVZdrQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verificarBiblia() {
  try {
    console.log('Verificando tabela versiculos_biblia...');
    
    // Verificar se a tabela existe
    const { data, error } = await supabase
      .from('versiculos_biblia')
      .select('*')
      .limit(5);
    
    if (error) {
      console.error('Erro ao acessar tabela:', error);
      return;
    }
    
    console.log('Tabela encontrada!');
    console.log('Primeiros 5 registros:', data);
    console.log('Total de registros:', data.length);
    
  } catch (error) {
    console.error('Erro geral:', error);
  }
}

verificarBiblia(); 