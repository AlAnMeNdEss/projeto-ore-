const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fidiulbnuucqfckozbrv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZGl1bGJudXVjcWZja296YnJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTA1ODksImV4cCI6MjA2NjI4NjU4OX0.ICE5GMLkDu7vVmHS44MOihIPr10w_z4VrJe7qfVZdrQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function adicionarGenesisCompleto() {
  try {
    console.log('📖 Adicionando Gênesis completo (capítulos 2-50)...');
    
    // Vou adicionar alguns capítulos importantes primeiro
    const versiculos = [
      // Gênesis 2:1-25 (Criação do homem)
      { livro: 'Gênesis', capitulo: 2, versiculo: '1', texto: 'Assim, pois, foram acabados os céus e a terra e todo o seu exército.' },
      { livro: 'Gênesis', capitulo: 2, versiculo: '2', texto: 'E, havendo Deus terminado no dia sétimo a sua obra, que fizera, descansou nesse dia de toda a sua obra que tinha feito.' },
      { livro: 'Gênesis', capitulo: 2, versiculo: '3', texto: 'E abençoou Deus o dia sétimo e o santificou; porque nele descansou de toda a obra que, como Criador, fizera.' },
      { livro: 'Gênesis', capitulo: 2, versiculo: '4', texto: 'Esta é a gênese dos céus e da terra quando foram criados, quando o Senhor Deus os criou.' },
      { livro: 'Gênesis', capitulo: 2, versiculo: '5', texto: 'Não havia ainda nenhuma planta do campo na terra, pois ainda nenhuma erva do campo havia brotado; porque o Senhor Deus não fizera chover sobre a terra, e também não havia homem para lavrar o solo.' },
      { livro: 'Gênesis', capitulo: 2, versiculo: '6', texto: 'Mas uma neblina subia da terra e regava toda a superfície do solo.' },
      { livro: 'Gênesis', capitulo: 2, versiculo: '7', texto: 'Então, formou o Senhor Deus ao homem do pó da terra e lhe soprou nas narinas o fôlego de vida, e o homem passou a ser alma vivente.' },
      { livro: 'Gênesis', capitulo: 2, versiculo: '8', texto: 'E plantou o Senhor Deus um jardim no Éden, na direção do Oriente, e pôs nele o homem que havia formado.' },
      { livro: 'Gênesis', capitulo: 2, versiculo: '9', texto: 'Do solo fez o Senhor Deus brotar toda sorte de árvores agradáveis à vista e boas para alimento; e também a árvore da vida no meio do jardim e a árvore do conhecimento do bem e do mal.' },
      { livro: 'Gênesis', capitulo: 2, versiculo: '10', texto: 'E saía um rio do Éden para regar o jardim e dali se dividia, repartindo-se em quatro braços.' },
      
      // Gênesis 3:1-24 (Queda do homem)
      { livro: 'Gênesis', capitulo: 3, versiculo: '1', texto: 'Mas a serpente, mais sagaz que todos os animais selváticos que o Senhor Deus tinha feito, disse à mulher: É assim que Deus disse: Não comereis de toda árvore do jardim?' },
      { livro: 'Gênesis', capitulo: 3, versiculo: '2', texto: 'Respondeu-lhe a mulher: Do fruto das árvores do jardim podemos comer,' },
      { livro: 'Gênesis', capitulo: 3, versiculo: '3', texto: 'mas do fruto da árvore que está no meio do jardim, disse Deus: Dele não comereis, nem tocareis nele, para que não morrais.' },
      { livro: 'Gênesis', capitulo: 3, versiculo: '4', texto: 'Então, a serpente disse à mulher: É certo que não morrereis.' },
      { livro: 'Gênesis', capitulo: 3, versiculo: '5', texto: 'Porque Deus sabe que no dia em que dele comerdes se vos abrirão os olhos e, como Deus, sereis conhecedores do bem e do mal.' },
      
      // Gênesis 6:1-22 (Noé)
      { livro: 'Gênesis', capitulo: 6, versiculo: '1', texto: 'Como se foram multiplicando os homens na terra, e lhes nasceram filhas,' },
      { livro: 'Gênesis', capitulo: 6, versiculo: '2', texto: 'vendo os filhos de Deus que as filhas dos homens eram formosas, tomaram para si mulheres, as que, entre todas, lhes agradaram.' },
      { livro: 'Gênesis', capitulo: 6, versiculo: '3', texto: 'Então, disse o Senhor: O meu Espírito não agirá para sempre no homem, pois este é carnal; e os seus dias serão cento e vinte anos.' },
      { livro: 'Gênesis', capitulo: 6, versiculo: '4', texto: 'Ora, naquele tempo havia gigantes na terra; e também depois, quando os filhos de Deus possuíram as filhas dos homens, as quais lhes deram filhos; estes foram valentes, varões de renome na antiguidade.' },
      { livro: 'Gênesis', capitulo: 6, versiculo: '5', texto: 'Viu o Senhor que a maldade do homem se havia multiplicado na terra e que toda a inclinação dos pensamentos do seu coração era só continuamente má;' },
      { livro: 'Gênesis', capitulo: 6, versiculo: '6', texto: 'então, se arrependeu o Senhor de ter feito o homem na terra, e isso lhe pesou no coração.' },
      { livro: 'Gênesis', capitulo: 6, versiculo: '7', texto: 'Disse o Senhor: Farei desaparecer da face da terra o homem que criei, o homem e o animal, os répteis e as aves dos céus; porque me arrependo de os haver feito.' },
      { livro: 'Gênesis', capitulo: 6, versiculo: '8', texto: 'Porém Noé achou graça diante do Senhor.' },
      { livro: 'Gênesis', capitulo: 6, versiculo: '9', texto: 'Eis a história de Noé. Noé era homem justo e íntegro entre os seus contemporâneos; Noé andava com Deus.' },
      { livro: 'Gênesis', capitulo: 6, versiculo: '10', texto: 'Gerou três filhos: Sem, Cam e Jafé.' },
      
      // Gênesis 12:1-9 (Chamado de Abraão)
      { livro: 'Gênesis', capitulo: 12, versiculo: '1', texto: 'Ora, disse o Senhor a Abrão: Sai da tua terra, da tua parentela e da casa de teu pai e vai para a terra que te mostrarei;' },
      { livro: 'Gênesis', capitulo: 12, versiculo: '2', texto: 'de ti farei uma grande nação, e te abençoarei e te engrandecerei o nome. Sê tu uma bênção!' },
      { livro: 'Gênesis', capitulo: 12, versiculo: '3', texto: 'Abençoarei os que te abençoarem e amaldiçoarei os que te amaldiçoarem; em ti serão benditas todas as famílias da terra.' },
      { livro: 'Gênesis', capitulo: 12, versiculo: '4', texto: 'Partiu, pois, Abrão, como lho ordenara o Senhor, e foi Ló com ele; e era Abrão da idade de setenta e cinco anos quando saiu de Harã.' },
      { livro: 'Gênesis', capitulo: 12, versiculo: '5', texto: 'Tomou Abrão a Sarai, sua mulher, e a Ló, filho de seu irmão, e todos os bens que haviam adquirido, e as pessoas que lhes acresceram em Harã; e partiram para a terra de Canaã; e foram para a terra de Canaã.' },
      
      // Gênesis 22:1-18 (Sacrifício de Isaque)
      { livro: 'Gênesis', capitulo: 22, versiculo: '1', texto: 'Depois dessas coisas, pôs Deus Abraão à prova e lhe disse: Abraão! Este lhe respondeu: Eis-me aqui!' },
      { livro: 'Gênesis', capitulo: 22, versiculo: '2', texto: 'Então, disse: Toma teu filho, teu único filho, Isaque, a quem amas, e vai à terra de Moriá; oferece-o ali em holocausto, sobre um dos montes, que eu te mostrarei.' },
      { livro: 'Gênesis', capitulo: 22, versiculo: '3', texto: 'Levantou-se, pois, Abraão de madrugada, albardou o seu jumento e, tomando consigo dois dos seus servos e Isaque, seu filho, cortou lenha para o holocausto e foi para o lugar que Deus lhe havia indicado.' },
      { livro: 'Gênesis', capitulo: 22, versiculo: '4', texto: 'Ao terceiro dia, levantou Abraão os olhos e viu o lugar de longe.' },
      { livro: 'Gênesis', capitulo: 22, versiculo: '5', texto: 'E disse a seus servos: Ficai-vos aqui com o jumento; eu e o rapaz iremos até lá e, havendo adorado, voltaremos para vós outros.' },
      { livro: 'Gênesis', capitulo: 22, versiculo: '6', texto: 'Tomou Abraão a lenha do holocausto e a colocou sobre Isaque, seu filho; ele, porém, levava nas mãos o fogo e o cutelo. Assim caminhavam ambos juntos.' },
      { livro: 'Gênesis', capitulo: 22, versiculo: '7', texto: 'Quando Isaque disse a Abraão, seu pai: Meu pai! Respondeu Abraão: Eis-me aqui, meu filho! Perguntou-lhe Isaque: Eis o fogo e a lenha, mas onde está o cordeiro para o holocausto?' },
      { livro: 'Gênesis', capitulo: 22, versiculo: '8', texto: 'Respondeu Abraão: Deus proverá para si, meu filho, o cordeiro para o holocausto; e seguiam ambos juntos.' },
      { livro: 'Gênesis', capitulo: 22, versiculo: '9', texto: 'Chegaram ao lugar que Deus lhe havia indicado; ali edificou Abraão um altar, sobrepôs a lenha, amarrou Isaque, seu filho, e o deitou no altar, em cima da lenha.' },
      { livro: 'Gênesis', capitulo: 22, versiculo: '10', texto: 'E, estendendo a mão, tomou o cutelo para imolar o filho.' },
      { livro: 'Gênesis', capitulo: 22, versiculo: '11', texto: 'Mas do céu lhe bradou o Anjo do Senhor: Abraão! Abraão! Ele respondeu: Eis-me aqui!' },
      { livro: 'Gênesis', capitulo: 22, versiculo: '12', texto: 'Então, lhe disse: Não estendas a mão sobre o rapaz e nada lhe faças; pois agora sei que temes a Deus, porquanto não me negaste o filho, o teu único filho.' },
      { livro: 'Gênesis', capitulo: 22, versiculo: '13', texto: 'Tendo Abraão erguido os olhos, viu atrás de si um carneiro preso pelos chifres entre os arbustos; tomou Abraão o carneiro e o ofereceu em holocausto, em lugar de seu filho.' },
      { livro: 'Gênesis', capitulo: 22, versiculo: '14', texto: 'E pôs Abraão por nome àquele lugar O Senhor Proverá; donde se diz até ao dia de hoje: No monte do Senhor se proverá.' },
      { livro: 'Gênesis', capitulo: 22, versiculo: '15', texto: 'Tendo bradado o Anjo do Senhor a Abraão, segunda vez, do céu,' },
      { livro: 'Gênesis', capitulo: 22, versiculo: '16', texto: 'disse: Jurei por mim mesmo, diz o Senhor, porquanto fizeste isto e não me negaste o filho, o teu único filho,' },
      { livro: 'Gênesis', capitulo: 22, versiculo: '17', texto: 'que deveras te abençoarei e certamente multiplicarei a tua descendência como as estrelas dos céus e como a areia na praia do mar; e a tua descendência possuirá a porta dos seus inimigos;' },
      { livro: 'Gênesis', capitulo: 22, versiculo: '18', texto: 'e nela serão benditas todas as nações da terra, porquanto obedeceste à minha voz.' },
      
      // Gênesis 37:1-11 (José)
      { livro: 'Gênesis', capitulo: 37, versiculo: '1', texto: 'Habitou Jacó na terra das peregrinações de seu pai, na terra de Canaã.' },
      { livro: 'Gênesis', capitulo: 37, versiculo: '2', texto: 'Esta é a história da família de Jacó. José, aos dezessete anos de idade, estava apascentando as ovelhas com seus irmãos; sendo ainda jovem, andava com os filhos de Bila e com os filhos de Zilpa, mulheres de seu pai; e José trazia más notícias deles a seu pai.' },
      { livro: 'Gênesis', capitulo: 37, versiculo: '3', texto: 'Israel amava mais a José que a todos os seus filhos, porque era filho da sua velhice; e fez-lhe uma túnica de várias cores.' },
      { livro: 'Gênesis', capitulo: 37, versiculo: '4', texto: 'Vendo seus irmãos que seu pai o amava mais que a todos os outros filhos, odiaram-no e já não lhe podiam falar pacificamente.' },
      { livro: 'Gênesis', capitulo: 37, versiculo: '5', texto: 'Teve José um sonho e o relatou a seus irmãos; por isso, o odiaram ainda mais.' },
      { livro: 'Gênesis', capitulo: 37, versiculo: '6', texto: 'Disse-lhes: Ouvi, peço-vos, este sonho que tive:' },
      { livro: 'Gênesis', capitulo: 37, versiculo: '7', texto: 'Estávamos atando molhos no meio do campo, quando o meu molho se levantou e ficou em pé; e os vossos molhos o rodeavam e se inclinavam perante o meu.' },
      { livro: 'Gênesis', capitulo: 37, versiculo: '8', texto: 'Então, lhe disseram seus irmãos: Tu, deveras, reinarás sobre nós? Ou, deveras, terás domínio sobre nós? E tanto mais o odiavam por causa dos seus sonhos e das suas palavras.' },
      { livro: 'Gênesis', capitulo: 37, versiculo: '9', texto: 'Teve José ainda outro sonho e o relatou a seus irmãos, dizendo: Tive ainda outro sonho: eis que o sol, a lua e onze estrelas se inclinavam perante mim.' },
      { livro: 'Gênesis', capitulo: 37, versiculo: '10', texto: 'Contou-o a seu pai e a seus irmãos; seu pai, porém, o repreendeu e lhe disse: Que sonho é esse que tiveste? Acaso, viremos eu, tua mãe e teus irmãos a inclinar-nos perante ti, até à terra?' },
      { livro: 'Gênesis', capitulo: 37, versiculo: '11', texto: 'Seus irmãos o invejavam; seu pai, porém, guardava o caso no seu coração.' }
    ];
    
    const { data, error } = await supabase
      .from('versiculos_biblia')
      .insert(versiculos);
    
    if (error) {
      console.error('❌ Erro:', error);
      return;
    }
    
    console.log('✅ Gênesis expandido adicionado com sucesso!');
    console.log(`📊 Total de versículos inseridos: ${versiculos.length}`);
    console.log('📖 Capítulos adicionados: 2, 3, 6, 12, 22, 37');
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

adicionarGenesisCompleto(); 