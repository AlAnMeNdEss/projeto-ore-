const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fidiulbnuucqfckozbrv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZGl1bGJudXVjcWZja296YnJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTA1ODksImV4cCI6MjA2NjI4NjU4OX0.ICE5GMLkDu7vVmHS44MOihIPr10w_z4VrJe7qfVZdrQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function verificarMiqueiasEspecifico() {
  try {
    console.log('🔍 Verificação específica de Miqueias...');
    
    // Buscar todos os registros de Miqueias
    const { data: miqueias, error } = await supabase
      .from('versiculos_biblia')
      .select('*')
      .eq('livro', 'Miqueias');
    
    if (error) {
      console.error('❌ Erro:', error);
      return;
    }
    
    console.log(`📊 Total de versículos de Miqueias: ${miqueias?.length || 0}`);
    
    if (miqueias && miqueias.length > 0) {
      // Verificar se há caracteres especiais no nome
      const primeiro = miqueias[0];
      console.log('🔍 Análise do primeiro registro:');
      console.log(`  ID: ${primeiro.id}`);
      console.log(`  Livro: "${primeiro.livro}"`);
      console.log(`  Comprimento do nome: ${primeiro.livro.length}`);
      console.log(`  Códigos ASCII: ${primeiro.livro.split('').map(c => c.charCodeAt(0)).join(', ')}`);
      
      // Verificar se há espaços extras
      console.log(`  Com espaços: "${primeiro.livro.trim()}"`);
      console.log(`  É igual a "Miqueias": ${primeiro.livro === 'Miqueias'}`);
      console.log(`  É igual a "Miqueias" (trim): ${primeiro.livro.trim() === 'Miqueias'}`);
      
      // Testar busca com trim
      const { data: miqueiasTrim } = await supabase
        .from('versiculos_biblia')
        .select('*')
        .eq('livro', 'Miqueias'.trim());
      
      console.log(`📊 Busca com trim: ${miqueiasTrim?.length || 0} versículos`);
      
      // Verificar todos os nomes únicos
      const nomesUnicos = [...new Set(miqueias.map(v => v.livro))];
      console.log(`📋 Nomes únicos encontrados: ${nomesUnicos.map(n => `"${n}"`).join(', ')}`);
      
      // Testar busca com ilike
      const { data: miqueiasIlike } = await supabase
        .from('versiculos_biblia')
        .select('*')
        .ilike('livro', 'Miqueias');
      
      console.log(`📊 Busca com ILIKE: ${miqueiasIlike?.length || 0} versículos`);
      
    } else {
      console.log('❌ Nenhum registro de Miqueias encontrado');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

verificarMiqueiasEspecifico(); 