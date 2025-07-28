const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fidiulbnuucqfckozbrv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZGl1bGJudXVjcWZja296YnJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTA1ODksImV4cCI6MjA2NjI4NjU4OX0.ICE5GMLkDu7vVmHS44MOihIPr10w_z4VrJe7qfVZdrQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function adicionarLivrosFaltantes() {
  try {
    console.log('📖 Adicionando livros faltantes...');
    
    const versiculos = [
      // Salmos 23:1-6
      { livro: 'Salmos', capitulo: 23, versiculo: '1', texto: 'O Senhor é o meu pastor, nada me faltará.' },
      { livro: 'Salmos', capitulo: 23, versiculo: '2', texto: 'Ele me faz repousar em pastos verdejantes e me conduz às águas tranquilas.' },
      { livro: 'Salmos', capitulo: 23, versiculo: '3', texto: 'Ele restaura a minha alma e me guia pelos caminhos da justiça por amor do seu nome.' },
      { livro: 'Salmos', capitulo: 23, versiculo: '4', texto: 'Ainda que eu ande pelo vale da sombra da morte, não temerei mal algum, porque tu estás comigo; a tua vara e o teu cajado me consolam.' },
      { livro: 'Salmos', capitulo: 23, versiculo: '5', texto: 'Preparas-me uma mesa na presença dos meus adversários, unges-me a cabeça com óleo; o meu cálice transborda.' },
      { livro: 'Salmos', capitulo: 23, versiculo: '6', texto: 'Certamente que a bondade e a misericórdia me seguirão todos os dias da minha vida; e habitarei na casa do Senhor por longos dias.' },
      
      // João 3:16-18
      { livro: 'João', capitulo: 3, versiculo: '16', texto: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.' },
      { livro: 'João', capitulo: 3, versiculo: '17', texto: 'Porque Deus enviou o seu Filho ao mundo, não para que julgasse o mundo, mas para que o mundo fosse salvo por ele.' },
      { livro: 'João', capitulo: 3, versiculo: '18', texto: 'Quem crê nele não é julgado; quem não crê já está julgado, porquanto não crê no nome do unigênito Filho de Deus.' },
      
      // Mateus 5:1-5
      { livro: 'Mateus', capitulo: 5, versiculo: '1', texto: 'Vendo Jesus as multidões, subiu ao monte, e, como se assentasse, aproximaram-se os seus discípulos.' },
      { livro: 'Mateus', capitulo: 5, versiculo: '2', texto: 'E, abrindo a boca, os ensinava, dizendo:' },
      { livro: 'Mateus', capitulo: 5, versiculo: '3', texto: 'Bem-aventurados os pobres de espírito, porque deles é o reino dos céus.' },
      { livro: 'Mateus', capitulo: 5, versiculo: '4', texto: 'Bem-aventurados os que choram, porque serão consolados.' },
      { livro: 'Mateus', capitulo: 5, versiculo: '5', texto: 'Bem-aventurados os mansos, porque herdarão a terra.' },
      
      // Romanos 8:28,31-32
      { livro: 'Romanos', capitulo: 8, versiculo: '28', texto: 'Sabemos que todas as coisas cooperam para o bem daqueles que amam a Deus, daqueles que são chamados segundo o seu propósito.' },
      { livro: 'Romanos', capitulo: 8, versiculo: '31', texto: 'Que diremos, pois, à vista destas coisas? Se Deus é por nós, quem será contra nós?' },
      { livro: 'Romanos', capitulo: 8, versiculo: '32', texto: 'Aquele que não poupou o seu próprio Filho, antes, por todos nós o entregou, porventura, não nos dará graciosamente com ele todas as coisas?' },
      
      // Filipenses 4:6-8,13
      { livro: 'Filipenses', capitulo: 4, versiculo: '6', texto: 'Não andeis ansiosos de coisa alguma; em tudo, porém, sejam conhecidas, diante de Deus, as vossas petições, pela oração e pela súplica, com ações de graças.' },
      { livro: 'Filipenses', capitulo: 4, versiculo: '7', texto: 'E a paz de Deus, que excede todo o entendimento, guardará o vosso coração e a vossa mente em Cristo Jesus.' },
      { livro: 'Filipenses', capitulo: 4, versiculo: '8', texto: 'Finalmente, irmãos, tudo o que é verdadeiro, tudo o que é respeitável, tudo o que é justo, tudo o que é puro, tudo o que é amável, tudo o que é de boa fama, se alguma virtude há e se algum louvor existe, seja isso o que ocupe o vosso pensamento.' },
      { livro: 'Filipenses', capitulo: 4, versiculo: '13', texto: 'Tudo posso naquele que me fortalece.' }
    ];
    
    const { data, error } = await supabase
      .from('versiculos_biblia')
      .insert(versiculos);
    
    if (error) {
      console.error('❌ Erro:', error);
      return;
    }
    
    console.log('✅ Livros adicionados com sucesso!');
    console.log(`📊 Total de versículos inseridos: ${versiculos.length}`);
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

adicionarLivrosFaltantes(); 