import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fidiulbnuucqfckozbrv.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZGl1bGJudXVjcWZja296YnJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDcxMDU4OSwiZXhwIjoyMDY2Mjg2NTg5fQ.geZx43mnZ_yI3qvu4q1Z23NkLcXCGvGpWfoDt2PKi58';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Versículos de teste para inserir
const versiculosTeste = [
  // Gênesis 1
  { livro: 'Gênesis', capitulo: 1, versiculo: 1, texto: 'No princípio Deus criou os céus e a terra.' },
  { livro: 'Gênesis', capitulo: 1, versiculo: 2, texto: 'A terra, porém, estava sem forma e vazia; havia trevas sobre a face do abismo, e o Espírito de Deus pairava sobre as águas.' },
  { livro: 'Gênesis', capitulo: 1, versiculo: 3, texto: 'Disse Deus: Haja luz; e houve luz.' },
  { livro: 'Gênesis', capitulo: 1, versiculo: 4, texto: 'Viu Deus que a luz era boa; e fez separação entre a luz e as trevas.' },
  { livro: 'Gênesis', capitulo: 1, versiculo: 5, texto: 'Chamou Deus à luz Dia, e às trevas, Noite. Houve tarde e manhã, o primeiro dia.' },
  
  // Salmos 23
  { livro: 'Salmos', capitulo: 23, versiculo: 1, texto: 'O Senhor é o meu pastor; nada me faltará.' },
  { livro: 'Salmos', capitulo: 23, versiculo: 2, texto: 'Deitar-me faz em verdes pastos, guia-me mansamente a águas tranqüilas.' },
  { livro: 'Salmos', capitulo: 23, versiculo: 3, texto: 'Refrigera a minha alma; guia-me pelas veredas da justiça, por amor do seu nome.' },
  { livro: 'Salmos', capitulo: 23, versiculo: 4, texto: 'Ainda que eu ande pelo vale da sombra da morte, não temerei mal algum, porque tu estás comigo; a tua vara e o teu cajado me consolam.' },
  { livro: 'Salmos', capitulo: 23, versiculo: 5, texto: 'Preparas uma mesa perante mim na presença dos meus inimigos, unges a minha cabeça com óleo, o meu cálice transborda.' },
  { livro: 'Salmos', capitulo: 23, versiculo: 6, texto: 'Certamente que a bondade e a misericórdia me seguirão todos os dias da minha vida; e habitarei na casa do Senhor por longos dias.' },
  
  // João 3
  { livro: 'João', capitulo: 3, versiculo: 16, texto: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.' },
  { livro: 'João', capitulo: 3, versiculo: 17, texto: 'Porque Deus enviou o seu Filho ao mundo, não para que condenasse o mundo, mas para que o mundo fosse salvo por ele.' },
  { livro: 'João', capitulo: 3, versiculo: 18, texto: 'Quem crê nele não é condenado; mas quem não crê já está condenado, porquanto não crê no nome do unigênito Filho de Deus.' },
  
  // Mateus 28
  { livro: 'Mateus', capitulo: 28, versiculo: 19, texto: 'Portanto ide, fazei discípulos de todas as nações, batizando-os em nome do Pai, e do Filho, e do Espírito Santo;' },
  { livro: 'Mateus', capitulo: 28, versiculo: 20, texto: 'ensinando-os a guardar todas as coisas que eu vos tenho mandado; e eis que eu estou convosco todos os dias, até a consumação dos séculos. Amém.' },
  
  // Romanos 8
  { livro: 'Romanos', capitulo: 8, versiculo: 28, texto: 'E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus, daqueles que são chamados segundo o seu propósito.' },
  { livro: 'Romanos', capitulo: 8, versiculo: 29, texto: 'Porque os que dantes conheceu também os predestinou para serem conformes à imagem de seu Filho, a fim de que ele seja o primogênito entre muitos irmãos.' },
  { livro: 'Romanos', capitulo: 8, versiculo: 30, texto: 'E aos que predestinou a estes também chamou; e aos que chamou a estes também justificou; e aos que justificou a estes também glorificou.' }
];

async function inserirVersiculosTeste() {
  try {
    console.log('Inserindo versículos de teste no Supabase...');
    
    // Primeiro, limpar a tabela (opcional)
    const { error: deleteError } = await supabase
      .from('versiculos_biblia')
      .delete()
      .neq('id', 0); // Deletar todos os registros
    
    if (deleteError) {
      console.log('Aviso: Não foi possível limpar a tabela:', deleteError.message);
    } else {
      console.log('Tabela limpa com sucesso!');
    }
    
    // Inserir os versículos de teste
    const { data, error } = await supabase
      .from('versiculos_biblia')
      .insert(versiculosTeste);
    
    if (error) {
      console.error('Erro ao inserir versículos:', error);
      return;
    }
    
    console.log('✅ Versículos de teste inseridos com sucesso!');
    console.log(`📖 Total inserido: ${versiculosTeste.length} versículos`);
    console.log('\nVersículos inseridos:');
    versiculosTeste.forEach(v => {
      console.log(`- ${v.livro} ${v.capitulo}:${v.versiculo}`);
    });
    
  } catch (error) {
    console.error('Erro geral:', error);
  }
}

inserirVersiculosTeste(); 