// Lista otimizada de palavras-chave e versículos associados
// Pode ser expandida conforme necessário, mantendo performance

export type KeywordVerse = {
  palavra: string;
  versiculos: {
    referencia: string;
    texto: string;
  }[];
};

export const KEYWORDS: KeywordVerse[] = [
  {
    palavra: "amor",
    versiculos: [
      {
        referencia: "1 Coríntios 13:4-5",
        texto: "O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha. Não maltrata, não procura seus interesses, não se ira facilmente, não guarda rancor.",
      },
      {
        referencia: "João 3:16",
        texto: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo o que nele crer não pereça, mas tenha a vida eterna.",
      },
      {
        referencia: "Romanos 8:39",
        texto: "Nem altura, nem profundidade, nem qualquer outra coisa na criação será capaz de nos separar do amor de Deus que está em Cristo Jesus, nosso Senhor.",
      },
    ],
  },
  {
    palavra: "fé",
    versiculos: [
      {
        referencia: "Hebreus 11:1",
        texto: "Ora, a fé é a certeza daquilo que esperamos e a prova das coisas que não vemos.",
      },
      {
        referencia: "Marcos 11:24",
        texto: "Portanto, eu lhes digo: tudo o que vocês pedirem em oração, creiam que já o receberam, e assim lhes sucederá.",
      },
      {
        referencia: "Romanos 10:17",
        texto: "Consequentemente, a fé vem por se ouvir a mensagem, e a mensagem é ouvida mediante a palavra de Cristo.",
      },
    ],
  },
  {
    palavra: "esperança",
    versiculos: [
      {
        referencia: "Romanos 15:13",
        texto: "Que o Deus da esperança os encha de toda alegria e paz, por sua confiança nele, para que vocês transbordem de esperança, pelo poder do Espírito Santo.",
      },
      {
        referencia: "Lamentações 3:21-23",
        texto: "Quero trazer à memória o que me pode dar esperança: As misericórdias do Senhor são a causa de não sermos consumidos, porque as suas misericórdias não têm fim; renovam-se cada manhã.",
      },
    ],
  },
  {
    palavra: "paz",
    versiculos: [
      {
        referencia: "Filipenses 4:7",
        texto: "E a paz de Deus, que excede todo o entendimento, guardará o coração e a mente de vocês em Cristo Jesus.",
      },
      {
        referencia: "João 14:27",
        texto: "Deixo-lhes a paz; a minha paz lhes dou. Não a dou como o mundo a dá. Não se perturbe o seu coração, nem tenham medo.",
      },
    ],
  },
  {
    palavra: "perdão",
    versiculos: [
      {
        referencia: "Mateus 6:14",
        texto: "Pois se perdoarem as ofensas uns dos outros, o Pai celestial também lhes perdoará.",
      },
      {
        referencia: "1 João 1:9",
        texto: "Se confessarmos os nossos pecados, ele é fiel e justo para perdoar os nossos pecados e nos purificar de toda injustiça.",
      },
    ],
  },
  {
    palavra: "sabedoria",
    versiculos: [
      {
        referencia: "Tiago 1:5",
        texto: "Se algum de vocês tem falta de sabedoria, peça-a a Deus, que a todos dá livremente, de boa vontade; e lhe será concedida.",
      },
      {
        referencia: "Provérbios 3:13",
        texto: "Como é feliz o homem que acha a sabedoria, o homem que obtém entendimento.",
      },
    ],
  },
  {
    palavra: "cura",
    versiculos: [
      {
        referencia: "Isaías 53:5",
        texto: "Mas ele foi ferido por causa das nossas transgressões, esmagado por causa de nossas iniquidades; o castigo que nos trouxe paz estava sobre ele, e pelas suas feridas fomos curados.",
      },
      {
        referencia: "Salmos 103:2-3",
        texto: "Bendiga o Senhor a minha alma! Não esqueça nenhuma de suas bênçãos! É ele que perdoa todos os seus pecados e cura todas as suas doenças.",
      },
    ],
  },
  {
    palavra: "força",
    versiculos: [
      {
        referencia: "Filipenses 4:13",
        texto: "Tudo posso naquele que me fortalece.",
      },
      {
        referencia: "Isaías 40:31",
        texto: "Mas aqueles que esperam no Senhor renovam as suas forças. Voam alto como águias; correm e não ficam exaustos, andam e não se cansam.",
      },
    ],
  },
  {
    palavra: "alegria",
    versiculos: [
      {
        referencia: "Salmos 30:5",
        texto: "O choro pode persistir uma noite, mas de manhã irrompe a alegria.",
      },
      {
        referencia: "Neemias 8:10",
        texto: "A alegria do Senhor é a nossa força.",
      },
    ],
  },
  {
    palavra: "gratidão",
    versiculos: [
      {
        referencia: "1 Tessalonicenses 5:18",
        texto: "Deem graças em todas as circunstâncias, pois esta é a vontade de Deus para vocês em Cristo Jesus.",
      },
      {
        referencia: "Salmos 136:1",
        texto: "Deem graças ao Senhor, porque ele é bom. O seu amor dura para sempre.",
      },
    ],
  },
  {
    palavra: "proteção",
    versiculos: [
      {
        referencia: "Salmos 91:1-2",
        texto: "Aquele que habita no abrigo do Altíssimo e descansa à sombra do Todo-poderoso pode dizer ao Senhor: 'Tu és o meu refúgio e a minha fortaleza, o meu Deus, em quem confio.'",
      },
      {
        referencia: "Salmos 121:7-8",
        texto: "O Senhor o protegerá de todo o mal, protegerá a sua vida. O Senhor protegerá a sua saída e a sua chegada, desde agora e para sempre.",
      },
    ],
  },
  {
    palavra: "vitória",
    versiculos: [
      {
        referencia: "1 Coríntios 15:57",
        texto: "Mas graças a Deus, que nos dá a vitória por meio de nosso Senhor Jesus Cristo.",
      },
      {
        referencia: "Romanos 8:37",
        texto: "Mas em todas estas coisas somos mais que vencedores, por meio daquele que nos amou.",
      },
    ],
  },
  {
    palavra: "família",
    versiculos: [
      {
        referencia: "Josué 24:15",
        texto: "Eu e a minha casa serviremos ao Senhor.",
      },
      {
        referencia: "Salmos 128:3",
        texto: "Sua esposa será como videira frutífera em sua casa; seus filhos serão como brotos de oliveira ao redor da sua mesa.",
      },
    ],
  },
  {
    palavra: "oração",
    versiculos: [
      {
        referencia: "Filipenses 4:6",
        texto: "Não andem ansiosos por coisa alguma, mas em tudo, pela oração e súplicas, e com ação de graças, apresentem seus pedidos a Deus.",
      },
      {
        referencia: "Mateus 7:7",
        texto: "Peçam, e lhes será dado; busquem, e encontrarão; batam, e a porta lhes será aberta.",
      },
    ],
  },
  {
    palavra: "salvação",
    versiculos: [
      {
        referencia: "Atos 4:12",
        texto: "Não há salvação em nenhum outro, pois debaixo do céu não há nenhum outro nome dado aos homens pelo qual devamos ser salvos.",
      },
      {
        referencia: "Romanos 10:9",
        texto: "Se você confessar com a sua boca que Jesus é Senhor e crer em seu coração que Deus o ressuscitou dentre os mortos, será salvo.",
      },
    ],
  },
]; 