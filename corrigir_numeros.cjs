const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fidiulbnuucqfckozbrv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZGl1bGJudXVjcWZja296YnJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTA1ODksImV4cCI6MjA2NjI4NjU4OX0.ICE5GMLkDu7vVmHS44MOihIPr10w_z4VrJe7qfVZdrQ';

const supabase = createClient(supabaseUrl, supabaseKey);

// Mapeamento de números para nomes dos livros
const livrosMap = {
  '1': 'Gênesis',
  '2': 'Êxodo',
  '3': 'Levítico',
  '4': 'Números',
  '5': 'Deuteronômio',
  '6': 'Josué',
  '7': 'Juízes',
  '8': 'Rute',
  '9': '1 Samuel',
  '10': '2 Samuel',
  '11': '1 Reis',
  '12': '2 Reis',
  '13': '1 Crônicas',
  '14': '2 Crônicas',
  '15': 'Esdras',
  '16': 'Neemias',
  '17': 'Ester',
  '18': 'Jó',
  '19': 'Salmos',
  '20': 'Provérbios',
  '21': 'Eclesiastes',
  '22': 'Cânticos',
  '23': 'Isaías',
  '24': 'Jeremias',
  '25': 'Lamentações',
  '26': 'Ezequiel',
  '27': 'Daniel',
  '28': 'Oséias',
  '29': 'Joel',
  '30': 'Amós',
  '31': 'Obadias',
  '32': 'Jonas',
  '33': 'Miquéias',
  '34': 'Naum',
  '35': 'Habacuque',
  '36': 'Sofonias',
  '37': 'Ageu',
  '38': 'Zacarias',
  '39': 'Malaquias',
  '40': 'Mateus',
  '41': 'Marcos',
  '42': 'Lucas',
  '43': 'João',
  '44': 'Atos',
  '45': 'Romanos',
  '46': '1 Coríntios',
  '47': '2 Coríntios',
  '48': 'Gálatas',
  '49': 'Efésios',
  '50': 'Filipenses',
  '51': 'Colossenses',
  '52': '1 Tessalonicenses',
  '53': '2 Tessalonicenses',
  '54': '1 Timóteo',
  '55': '2 Timóteo',
  '56': 'Tito',
  '57': 'Filemom',
  '58': 'Hebreus',
  '59': 'Tiago',
  '60': '1 Pedro',
  '61': '2 Pedro',
  '62': '1 João',
  '63': '2 João',
  '64': '3 João',
  '65': 'Judas',
  '66': 'Apocalipse'
};

async function corrigirNumeros() {
  try {
    console.log('🔧 Corrigindo números dos livros...');
    
    // Atualizar cada livro
    for (const [numero, nome] of Object.entries(livrosMap)) {
      const numeroCompleto = (2000 + parseInt(numero) - 1).toString();
      console.log(`📖 Atualizando ${numeroCompleto} → ${nome}`);
      
      const { error } = await supabase
        .from('versiculos_biblia')
        .update({ livro: nome })
        .eq('livro', numeroCompleto);
      
      if (error) {
        console.error(`❌ Erro ao atualizar ${numeroCompleto}:`, error);
      }
    }
    
    console.log('✅ Números dos livros corrigidos!');
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

corrigirNumeros(); 