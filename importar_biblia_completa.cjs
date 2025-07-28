const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fidiulbnuucqfckozbrv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZGl1bGJudXVjcWZja296YnJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTA1ODksImV4cCI6MjA2NjI4NjU4OX0.ICE5GMLkDu7vVmHS44MOihIPr10w_z4VrJe7qfVZdrQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function importarBibliaCompleta() {
  try {
    console.log('📖 Importando bíblia completa...');
    
    // Limpar tabela atual
    console.log('🧹 Limpando tabela atual...');
    const { error: deleteError } = await supabase
      .from('versiculos_biblia')
      .delete()
      .neq('id', 0);
    
    if (deleteError) {
      console.error('❌ Erro ao limpar tabela:', deleteError);
      return;
    }
    
    console.log('✅ Tabela limpa com sucesso!');
    
    // Adicionar alguns livros importantes
    const versiculos = [
      // Gênesis 1:1-31 (completo)
      { livro: 'Gênesis', capitulo: 1, versiculo: '1', texto: 'No princípio Deus criou os céus e a terra.' },
      { livro: 'Gênesis', capitulo: 1, versiculo: '2', texto: 'A terra, porém, estava sem forma e vazia; havia trevas sobre a face do abismo, e o Espírito de Deus pairava sobre as águas.' },
      { livro: 'Gênesis', capitulo: 1, versiculo: '3', texto: 'Disse Deus: Haja luz; e houve luz.' },
      { livro: 'Gênesis', capitulo: 1, versiculo: '4', texto: 'Viu Deus que a luz era boa; e fez separação entre a luz e as trevas.' },
      { livro: 'Gênesis', capitulo: 1, versiculo: '5', texto: 'Chamou Deus à luz Dia, e às trevas, Noite. Houve tarde e manhã, o primeiro dia.' },
      { livro: 'Gênesis', capitulo: 1, versiculo: '6', texto: 'Disse também Deus: Haja firmamento no meio das águas e separação entre águas e águas.' },
      { livro: 'Gênesis', capitulo: 1, versiculo: '7', texto: 'Fez, pois, Deus o firmamento e a separação entre as águas que estavam debaixo do firmamento e as que estavam por cima do firmamento. E assim se fez.' },
      { livro: 'Gênesis', capitulo: 1, versiculo: '8', texto: 'Chamou Deus ao firmamento Céus. Houve tarde e manhã, o segundo dia.' },
      { livro: 'Gênesis', capitulo: 1, versiculo: '9', texto: 'Disse também Deus: Ajuntem-se as águas debaixo dos céus num só lugar, e apareça a porção seca. E assim se fez.' },
      { livro: 'Gênesis', capitulo: 1, versiculo: '10', texto: 'À porção seca chamou Deus Terra e ao ajuntamento das águas, Mares. E viu Deus que isso era bom.' },
      { livro: 'Gênesis', capitulo: 1, versiculo: '11', texto: 'Disse também Deus: Produza a terra relva, ervas que dêem semente e árvores frutíferas que dêem fruto segundo a sua espécie, cuja semente esteja nele, sobre a terra. E assim se fez.' },
      { livro: 'Gênesis', capitulo: 1, versiculo: '12', texto: 'A terra, pois, produziu relva, ervas que davam semente segundo a sua espécie e árvores que davam fruto, cuja semente estava nele, segundo a sua espécie. E viu Deus que isso era bom.' },
      { livro: 'Gênesis', capitulo: 1, versiculo: '13', texto: 'Houve tarde e manhã, o terceiro dia.' },
      { livro: 'Gênesis', capitulo: 1, versiculo: '14', texto: 'Disse também Deus: Haja luzeiros no firmamento dos céus, para fazerem separação entre o dia e a noite; e sejam eles para sinais, para estações, para dias e anos.' },
      { livro: 'Gênesis', capitulo: 1, versiculo: '15', texto: 'E sejam para luzeiros no firmamento dos céus, para alumiar a terra. E assim se fez.' },
      { livro: 'Gênesis', capitulo: 1, versiculo: '16', texto: 'Fez Deus os dois grandes luzeiros: o luzeiro maior para governar o dia, e o luzeiro menor para governar a noite; e fez também as estrelas.' },
      { livro: 'Gênesis', capitulo: 1, versiculo: '17', texto: 'E os colocou no firmamento dos céus para alumiar a terra,' },
      { livro: 'Gênesis', capitulo: 1, versiculo: '18', texto: 'para governar o dia e a noite e fazer separação entre a luz e as trevas. E viu Deus que isso era bom.' },
      { livro: 'Gênesis', capitulo: 1, versiculo: '19', texto: 'Houve tarde e manhã, o quarto dia.' },
      { livro: 'Gênesis', capitulo: 1, versiculo: '20', texto: 'Disse também Deus: Povoem as águas inúmeras criaturas vivas; e voem as aves sobre a terra, sob o firmamento dos céus.' },
      { livro: 'Gênesis', capitulo: 1, versiculo: '21', texto: 'Criou, pois, Deus os grandes animais marinhos e todos os seres viventes que rastejam, os quais povoavam as águas, segundo as suas espécies; e todas as aves, segundo as suas espécies. E viu Deus que isso era bom.' },
      { livro: 'Gênesis', capitulo: 1, versiculo: '22', texto: 'E Deus os abençoou, dizendo: Sede fecundos, multiplicai-vos e enchei as águas dos mares; e, na terra, se multipliquem as aves.' },
      { livro: 'Gênesis', capitulo: 1, versiculo: '23', texto: 'Houve tarde e manhã, o quinto dia.' },
      { livro: 'Gênesis', capitulo: 1, versiculo: '24', texto: 'Disse também Deus: Produza a terra seres viventes, segundo a sua espécie: animais domésticos, répteis e animais selváticos, segundo a sua espécie. E assim se fez.' },
      { livro: 'Gênesis', capitulo: 1, versiculo: '25', texto: 'Fez Deus os animais selváticos, segundo a sua espécie, e os animais domésticos, conforme a sua espécie, e todos os répteis da terra, segundo as suas espécies. E viu Deus que isso era bom.' },
      { livro: 'Gênesis', capitulo: 1, versiculo: '26', texto: 'Também disse Deus: Façamos o homem à nossa imagem, conforme a nossa semelhança; tenha ele domínio sobre os peixes do mar, sobre as aves dos céus, sobre os animais domésticos, sobre toda a terra e sobre todos os répteis que rastejam pela terra.' },
      { livro: 'Gênesis', capitulo: 1, versiculo: '27', texto: 'Criou Deus, pois, o homem à sua imagem, à imagem de Deus o criou; homem e mulher os criou.' },
      { livro: 'Gênesis', capitulo: 1, versiculo: '28', texto: 'E Deus os abençoou e lhes disse: Sede fecundos, multiplicai-vos, enchei a terra e sujeitai-a; dominai sobre os peixes do mar, sobre as aves dos céus e sobre todo animal que rasteja pela terra.' },
      { livro: 'Gênesis', capitulo: 1, versiculo: '29', texto: 'E disse Deus ainda: Eis que vos tenho dado todas as ervas que dão semente e se acham na superfície de toda a terra e todas as árvores em que há fruto que dê semente; isso vos será para mantimento.' },
      { livro: 'Gênesis', capitulo: 1, versiculo: '30', texto: 'E a todos os animais da terra, a todas as aves dos céus e a todos os répteis da terra, em que há fôlego de vida, toda erva verde lhes será para mantimento. E assim se fez.' },
      { livro: 'Gênesis', capitulo: 1, versiculo: '31', texto: 'Viu Deus tudo quanto fizera, e eis que era muito bom. Houve tarde e manhã, o sexto dia.' },
      
      // Salmos 23:1-6 (completo)
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
      
      // Mateus 5:1-12 (Sermão da Montanha)
      { livro: 'Mateus', capitulo: 5, versiculo: '1', texto: 'Vendo Jesus as multidões, subiu ao monte, e, como se assentasse, aproximaram-se os seus discípulos.' },
      { livro: 'Mateus', capitulo: 5, versiculo: '2', texto: 'E, abrindo a boca, os ensinava, dizendo:' },
      { livro: 'Mateus', capitulo: 5, versiculo: '3', texto: 'Bem-aventurados os pobres de espírito, porque deles é o reino dos céus.' },
      { livro: 'Mateus', capitulo: 5, versiculo: '4', texto: 'Bem-aventurados os que choram, porque serão consolados.' },
      { livro: 'Mateus', capitulo: 5, versiculo: '5', texto: 'Bem-aventurados os mansos, porque herdarão a terra.' },
      { livro: 'Mateus', capitulo: 5, versiculo: '6', texto: 'Bem-aventurados os que têm fome e sede de justiça, porque serão fartos.' },
      { livro: 'Mateus', capitulo: 5, versiculo: '7', texto: 'Bem-aventurados os misericordiosos, porque alcançarão misericórdia.' },
      { livro: 'Mateus', capitulo: 5, versiculo: '8', texto: 'Bem-aventurados os puros de coração, porque verão a Deus.' },
      { livro: 'Mateus', capitulo: 5, versiculo: '9', texto: 'Bem-aventurados os pacificadores, porque serão chamados filhos de Deus.' },
      { livro: 'Mateus', capitulo: 5, versiculo: '10', texto: 'Bem-aventurados os perseguidos por causa da justiça, porque deles é o reino dos céus.' },
      { livro: 'Mateus', capitulo: 5, versiculo: '11', texto: 'Bem-aventurados sois quando, por minha causa, vos injuriarem, e vos perseguirem, e, mentindo, disserem todo mal contra vós.' },
      { livro: 'Mateus', capitulo: 5, versiculo: '12', texto: 'Regozijai-vos e exultai, porque é grande o vosso galardão nos céus; pois assim perseguiram aos profetas que viveram antes de vós.' },
      
      // Romanos 8:28-39
      { livro: 'Romanos', capitulo: 8, versiculo: '28', texto: 'Sabemos que todas as coisas cooperam para o bem daqueles que amam a Deus, daqueles que são chamados segundo o seu propósito.' },
      { livro: 'Romanos', capitulo: 8, versiculo: '29', texto: 'Porquanto aos que de antemão conheceu, também os predestinou para serem conformes à imagem de seu Filho, a fim de que ele seja o primogênito entre muitos irmãos.' },
      { livro: 'Romanos', capitulo: 8, versiculo: '30', texto: 'E aos que predestinou, a esses também chamou; e aos que chamou, a esses também justificou; e aos que justificou, a esses também glorificou.' },
      { livro: 'Romanos', capitulo: 8, versiculo: '31', texto: 'Que diremos, pois, à vista destas coisas? Se Deus é por nós, quem será contra nós?' },
      { livro: 'Romanos', capitulo: 8, versiculo: '32', texto: 'Aquele que não poupou o seu próprio Filho, antes, por todos nós o entregou, porventura, não nos dará graciosamente com ele todas as coisas?' },
      { livro: 'Romanos', capitulo: 8, versiculo: '33', texto: 'Quem intentará acusação contra os eleitos de Deus? É Deus quem os justifica.' },
      { livro: 'Romanos', capitulo: 8, versiculo: '34', texto: 'Quem os condenará? É Cristo Jesus quem morreu ou, antes, quem ressuscitou, o qual está à direita de Deus e também intercede por nós.' },
      { livro: 'Romanos', capitulo: 8, versiculo: '35', texto: 'Quem nos separará do amor de Cristo? Será a tribulação, ou a angústia, ou a perseguição, ou a fome, ou a nudez, ou o perigo, ou a espada?' },
      { livro: 'Romanos', capitulo: 8, versiculo: '36', texto: 'Como está escrito: Por amor de ti, somos entregues à morte o dia todo, fomos considerados como ovelhas para o matadouro.' },
      { livro: 'Romanos', capitulo: 8, versiculo: '37', texto: 'Em todas estas coisas, porém, somos mais que vencedores, por meio daquele que nos amou.' },
      { livro: 'Romanos', capitulo: 8, versiculo: '38', texto: 'Porque estou certo de que nem a morte, nem a vida, nem os anjos, nem os principados, nem as coisas do presente, nem do porvir, nem os poderes,' },
      { livro: 'Romanos', capitulo: 8, versiculo: '39', texto: 'nem a altura, nem a profundidade, nem qualquer outra criatura poderá separar-nos do amor de Deus, que está em Cristo Jesus, nosso Senhor.' },
      
      // Filipenses 4:6-13
      { livro: 'Filipenses', capitulo: 4, versiculo: '6', texto: 'Não andeis ansiosos de coisa alguma; em tudo, porém, sejam conhecidas, diante de Deus, as vossas petições, pela oração e pela súplica, com ações de graças.' },
      { livro: 'Filipenses', capitulo: 4, versiculo: '7', texto: 'E a paz de Deus, que excede todo o entendimento, guardará o vosso coração e a vossa mente em Cristo Jesus.' },
      { livro: 'Filipenses', capitulo: 4, versiculo: '8', texto: 'Finalmente, irmãos, tudo o que é verdadeiro, tudo o que é respeitável, tudo o que é justo, tudo o que é puro, tudo o que é amável, tudo o que é de boa fama, se alguma virtude há e se algum louvor existe, seja isso o que ocupe o vosso pensamento.' },
      { livro: 'Filipenses', capitulo: 4, versiculo: '9', texto: 'O que também aprendestes, e recebestes, e ouvistes, e vistes em mim, isso praticai; e o Deus da paz será convosco.' },
      { livro: 'Filipenses', capitulo: 4, versiculo: '10', texto: 'Alegrei-me, sobremaneira, no Senhor porque, afinal, renovastes para comigo o vosso cuidado; o qual, na verdade, já tínheis, mas vos faltava oportunidade.' },
      { livro: 'Filipenses', capitulo: 4, versiculo: '11', texto: 'Não digo isto como por necessidade, porque já aprendi a contentar-me com o que tenho.' },
      { livro: 'Filipenses', capitulo: 4, versiculo: '12', texto: 'Sei estar abatido e também sei ter abundância; em toda a maneira e em todas as coisas estou experimentado, tanto em ter fartura como em ter fome, tanto em ter abundância como em padecer necessidade.' },
      { livro: 'Filipenses', capitulo: 4, versiculo: '13', texto: 'Tudo posso naquele que me fortalece.' }
    ];
    
    console.log(`📖 Importando ${versiculos.length} versículos...`);
    
    const { data, error } = await supabase
      .from('versiculos_biblia')
      .insert(versiculos);
    
    if (error) {
      console.error('❌ Erro:', error);
      return;
    }
    
    console.log('✅ Bíblia importada com sucesso!');
    console.log(`📊 Total de versículos: ${versiculos.length}`);
    console.log('📚 Livros disponíveis: Gênesis, Salmos, João, Mateus, Romanos, Filipenses');
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

importarBibliaCompleta(); 