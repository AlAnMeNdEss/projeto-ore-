const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fidiulbnuucqfckozbrv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZGl1bGJudXVjcWZja296YnJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTA1ODksImV4cCI6MjA2NjI4NjU4OX0.ICE5GMLkDu7vVmHS44MOihIPr10w_z4VrJe7qfVZdrQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testeRapido() {
  try {
    console.log('🔍 Teste rápido da bíblia...');
    
    const { data, error } = await supabase
      .from('versiculos_biblia')
      .select('*')
      .order('livro');
    
    if (error) {
      console.error('❌ Erro:', error);
      return;
    }
    
    console.log(`📊 Total de versículos: ${data.length}`);
    
    // Agrupar por livro
    const livros = {};
    data.forEach(v => {
      if (!livros[v.livro]) livros[v.livro] = 0;
      livros[v.livro]++;
    });
    
    console.log('\n📚 Livros disponíveis:');
    Object.keys(livros).forEach(livro => {
      console.log(`- ${livro}: ${livros[livro]} versículos`);
    });
    
    // Testar Gênesis especificamente
    console.log('\n📖 Testando Gênesis:');
    const genesis = data.filter(v => v.livro === 'Gênesis');
    console.log(`- Gênesis: ${genesis.length} versículos`);
    if (genesis.length > 0) {
      console.log(`- Primeiro: ${genesis[0].capitulo}:${genesis[0].versiculo}`);
      console.log(`- Último: ${genesis[genesis.length-1].capitulo}:${genesis[genesis.length-1].versiculo}`);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

testeRapido(); 