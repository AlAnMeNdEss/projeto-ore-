const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fidiulbnuucqfckozbrv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZGl1bGJudXVjcWZja296YnJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTA1ODksImV4cCI6MjA2NjI4NjU4OX0.ICE5GMLkDu7vVmHS44MOihIPr10w_z4VrJe7qfVZdrQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inserirVersiculosTeste() {
  try {
    console.log('📖 Inserindo versículos de teste...');
    
    const versiculos = [
      {
        livro: 'Salmos',
        capitulo: 23,
        versiculo: '1',
        texto: 'O Senhor é o meu pastor, nada me faltará.'
      },
      {
        livro: 'Salmos',
        capitulo: 23,
        versiculo: '2',
        texto: 'Ele me faz repousar em pastos verdejantes e me conduz às águas tranquilas.'
      },
      {
        livro: 'Salmos',
        capitulo: 23,
        versiculo: '3',
        texto: 'Ele restaura a minha alma e me guia pelos caminhos da justiça por amor do seu nome.'
      },
      {
        livro: 'João',
        capitulo: 3,
        versiculo: '16',
        texto: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.'
      },
      {
        livro: 'Gênesis',
        capitulo: 1,
        versiculo: '1',
        texto: 'No princípio Deus criou os céus e a terra.'
      }
    ];
    
    const { data, error } = await supabase
      .from('versiculos_biblia')
      .insert(versiculos);
    
    if (error) {
      console.error('❌ Erro:', error);
      return;
    }
    
    console.log('✅ Versículos inseridos com sucesso!');
    console.log('📊 Dados inseridos:', data);
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

inserirVersiculosTeste(); 