const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://fidiulbnuucqfckozbrv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZGl1bGJudXVjcWZja296YnJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTA1ODksImV4cCI6MjA2NjI4NjU4OX0.ICE5GMLkDu7vVmHS44MOihIPr10w_z4VrJe7qfVZdrQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function importarAlmeidaCSV() {
  try {
    console.log('📖 Importando bíblia Almeida do CSV...');
    
    // Verificar se o arquivo CSV existe
    const csvFile = 'almeida_rc (1).csv';
    if (!fs.existsSync(csvFile)) {
      console.log(`❌ Arquivo ${csvFile} não encontrado!`);
      return;
    }
    
    // Ler o arquivo CSV
    const csvContent = fs.readFileSync(csvFile, 'utf8');
    const linhas = csvContent.split('\n');
    
    console.log(`📊 Total de linhas no CSV: ${linhas.length}`);
    
    // Pular o cabeçalho e processar as linhas
    const versiculos = [];
    for (let i = 1; i < linhas.length; i++) {
      const linha = linhas[i].trim();
      if (!linha) continue;
      
      // Parsear CSV (lidando com aspas)
      const campos = parseCSVLine(linha);
      if (campos.length >= 4) {
        versiculos.push({
          livro: campos[0],
          capitulo: parseInt(campos[1]),
          versiculo: campos[2],
          texto: campos[3]
        });
      }
    }
    
    console.log(`📖 Total de versículos para importar: ${versiculos.length}`);
    
    // Limpar tabela atual
    console.log('🧹 Limpando tabela atual...');
    const { error: deleteError } = await supabase
      .from('versiculos_biblia')
      .delete()
      .neq('id', 0); // Deletar todos
    
    if (deleteError) {
      console.error('❌ Erro ao limpar tabela:', deleteError);
      return;
    }
    
    console.log('✅ Tabela limpa com sucesso!');
    
    // Importar em lotes de 1000
    const loteSize = 1000;
    let totalImportados = 0;
    
    for (let i = 0; i < versiculos.length; i += loteSize) {
      const lote = versiculos.slice(i, i + loteSize);
      
      console.log(`📦 Importando lote ${Math.floor(i/loteSize) + 1}/${Math.ceil(versiculos.length/loteSize)}...`);
      
      const { data, error } = await supabase
        .from('versiculos_biblia')
        .insert(lote);
      
      if (error) {
        console.error('❌ Erro ao importar lote:', error);
        return;
      }
      
      totalImportados += lote.length;
      console.log(`✅ Lote importado: ${lote.length} versículos`);
    }
    
    console.log(`🎉 Importação concluída!`);
    console.log(`📊 Total de versículos importados: ${totalImportados}`);
    
    // Mostrar alguns exemplos dos livros disponíveis
    const livrosUnicos = [...new Set(versiculos.map(v => v.livro))];
    console.log(`📚 Livros disponíveis: ${livrosUnicos.slice(0, 10).join(', ')}${livrosUnicos.length > 10 ? '...' : ''}`);
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // Pular próxima aspa
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

importarAlmeidaCSV(); 