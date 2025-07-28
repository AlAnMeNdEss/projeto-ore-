const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fidiulbnuucqfckozbrv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZGl1bGJudXVjcWZja296YnJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTA1ODksImV4cCI6MjA2NjI4NjU4OX0.ICE5GMLkDu7vVmHS44MOihIPr10w_z4VrJe7qfVZdrQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testarTodosVersiculos() {
  try {
    console.log('🔍 Testando todos os versículos da bíblia...\n');
    
    // Lista de livros e capítulos que sabemos que existem
    const testes = [
      { livro: 'Gênesis', capitulo: 1 },
      { livro: 'Salmos', capitulo: 23 },
      { livro: 'João', capitulo: 3 },
      { livro: 'Mateus', capitulo: 5 },
      { livro: 'Romanos', capitulo: 8 },
      { livro: 'Filipenses', capitulo: 4 }
    ];
    
    let totalVersiculos = 0;
    let totalLivros = 0;
    
    for (const teste of testes) {
      console.log(`📖 Testando ${teste.livro} capítulo ${teste.capitulo}...`);
      
      const { data, error } = await supabase
        .from('versiculos_biblia')
        .select('*')
        .eq('livro', teste.livro)
        .eq('capitulo', teste.capitulo)
        .order('versiculo', { ascending: true });
      
      if (error) {
        console.error(`❌ Erro ao buscar ${teste.livro} ${teste.capitulo}:`, error);
        continue;
      }
      
      if (data && data.length > 0) {
        console.log(`✅ ${teste.livro} ${teste.capitulo}: ${data.length} versículos encontrados`);
        console.log(`📝 Primeiro versículo: ${data[0].versiculo} - ${data[0].texto.substring(0, 50)}...`);
        console.log(`📝 Último versículo: ${data[data.length - 1].versiculo} - ${data[data.length - 1].texto.substring(0, 50)}...`);
        
        // Verificar se os versículos estão em ordem
        const versiculosOrdenados = data.every((v, i) => {
          if (i === 0) return true;
          return parseInt(v.versiculo) > parseInt(data[i - 1].versiculo);
        });
        
        if (versiculosOrdenados) {
          console.log(`✅ Versículos em ordem correta`);
        } else {
          console.log(`⚠️ Versículos fora de ordem`);
        }
        
        totalVersiculos += data.length;
        totalLivros++;
      } else {
        console.log(`❌ Nenhum versículo encontrado para ${teste.livro} ${teste.capitulo}`);
      }
      
      console.log(''); // Linha em branco
    }
    
    console.log('📊 RESUMO FINAL:');
    console.log(`📚 Livros funcionais: ${totalLivros}/${testes.length}`);
    console.log(`📖 Total de versículos: ${totalVersiculos}`);
    console.log(`📈 Média de versículos por capítulo: ${Math.round(totalVersiculos / totalLivros)}`);
    
    // Testar busca geral
    console.log('\n🔍 Testando busca geral...');
    const { data: todosVersiculos, error: erroGeral } = await supabase
      .from('versiculos_biblia')
      .select('*')
      .order('livro', { ascending: true })
      .order('capitulo', { ascending: true })
      .order('versiculo', { ascending: true });
    
    if (erroGeral) {
      console.error('❌ Erro na busca geral:', erroGeral);
    } else {
      console.log(`📊 Total geral de versículos na tabela: ${todosVersiculos.length}`);
      
      // Agrupar por livro
      const livros = {};
      todosVersiculos.forEach(v => {
        if (!livros[v.livro]) livros[v.livro] = [];
        livros[v.livro].push(v);
      });
      
      console.log('\n📚 Livros disponíveis:');
      Object.keys(livros).forEach(livro => {
        console.log(`- ${livro}: ${livros[livro].length} versículos`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testarTodosVersiculos(); 