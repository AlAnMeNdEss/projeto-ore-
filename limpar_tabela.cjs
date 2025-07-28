const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fidiulbnuucqfckozbrv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZGl1bGJudXVjcWZja296YnJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTA1ODksImV4cCI6MjA2NjI4NjU4OX0.ICE5GMLkDu7vVmHS44MOihIPr10w_z4VrJe7qfVZdrQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function limparTabela() {
  try {
    console.log('🧹 Limpando tabela versiculos_biblia...');
    
    const { error } = await supabase
      .from('versiculos_biblia')
      .delete()
      .neq('id', 0);
    
    if (error) {
      console.error('❌ Erro ao limpar:', error);
      return;
    }
    
    console.log('✅ Tabela limpa! Pronta para novo arquivo.');
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

limparTabela(); 