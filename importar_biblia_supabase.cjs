const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuração do Supabase
const supabaseUrl = 'https://fidiulbnuucqfckozbrv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZGl1bGJudXVjcWZja296YnJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTA1ODksImV4cCI6MjA2NjI4NjU4OX0.ICE5GMLkDu7vVmHS44MOihIPr10w_z4VrJe7qfVZdrQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function importarBibliaParaSupabase() {
  try {
    console.log('🚀 Iniciando importação da bíblia para o Supabase...');
    
    // Ler o arquivo JSON
    const jsonPath = path.join(__dirname, 'public', 'pt_nvi.json');
    console.log('📖 Lendo arquivo JSON:', jsonPath);
    
    const bibliaData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`✅ JSON carregado com sucesso! ${bibliaData.length} livros encontrados.`);
    
    // Verificar estrutura do primeiro livro
    const primeiroLivro = bibliaData[0];
    if (!primeiroLivro || !primeiroLivro.name || !primeiroLivro.chapters) {
      throw new Error('Estrutura do JSON inválida. Esperado: {name, chapters}');
    }
    
    console.log(`📚 Primeiro livro: ${primeiroLivro.name} com ${primeiroLivro.chapters.length} capítulos`);
    
    // Preparar dados para inserção
    const versiculosParaInserir = [];
    let totalVersiculos = 0;
    
    for (const livro of bibliaData) {
      console.log(`📖 Processando ${livro.name}...`);
      
      for (let capituloIndex = 0; capituloIndex < livro.chapters.length; capituloIndex++) {
        const capitulo = capituloIndex + 1;
        const versiculos = livro.chapters[capituloIndex];
        
        for (let versiculoIndex = 0; versiculoIndex < versiculos.length; versiculoIndex++) {
          const versiculo = versiculoIndex + 1;
          const texto = versiculos[versiculoIndex];
          
          versiculosParaInserir.push({
            livro: livro.name,
            capitulo: capitulo,
            versiculo: versiculo.toString(),
            texto: texto,
            traducao: 'nvi' // Nova Versão Internacional
          });
          
          totalVersiculos++;
          
          // Inserir em lotes de 1000 para evitar timeout
          if (versiculosParaInserir.length >= 1000) {
            await inserirLote(versiculosParaInserir);
            versiculosParaInserir.length = 0; // Limpar array
          }
        }
      }
    }
    
    // Inserir versículos restantes
    if (versiculosParaInserir.length > 0) {
      await inserirLote(versiculosParaInserir);
    }
    
    console.log(`🎉 Importação concluída! ${totalVersiculos} versículos inseridos no Supabase.`);
    
  } catch (error) {
    console.error('❌ Erro durante a importação:', error);
    process.exit(1);
  }
}

async function inserirLote(versiculos) {
  try {
    const { data, error } = await supabase
      .from('versiculos_biblia')
      .insert(versiculos);
    
    if (error) {
      console.error('❌ Erro ao inserir lote:', error);
      throw error;
    }
    
    console.log(`✅ Lote inserido com sucesso: ${versiculos.length} versículos`);
    
  } catch (error) {
    console.error('❌ Erro ao inserir lote:', error);
    throw error;
  }
}

// Verificar se a tabela existe
async function verificarTabela() {
  try {
    console.log('🔍 Verificando se a tabela versiculos_biblia existe...');
    
    const { data, error } = await supabase
      .from('versiculos_biblia')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Tabela não encontrada. Crie a tabela primeiro:');
      console.log(`
CREATE TABLE versiculos_biblia (
  id SERIAL PRIMARY KEY,
  livro TEXT NOT NULL,
  capitulo INTEGER NOT NULL,
  versiculo TEXT NOT NULL,
  texto TEXT NOT NULL,
  traducao TEXT DEFAULT 'nvi',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
      `);
      return false;
    }
    
    console.log('✅ Tabela versiculos_biblia encontrada!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao verificar tabela:', error);
    return false;
  }
}

// Função principal
async function main() {
  console.log('🔧 Script de importação da Bíblia para Supabase');
  console.log('================================================');
  
  // Verificar configuração
  if (!supabaseUrl || supabaseUrl === 'https://your-project.supabase.co') {
    console.error('❌ Configure VITE_SUPABASE_URL no arquivo .env');
    process.exit(1);
  }
  
  if (!supabaseKey || supabaseKey === 'your-anon-key') {
    console.error('❌ Configure VITE_SUPABASE_ANON_KEY no arquivo .env');
    process.exit(1);
  }
  
  // Verificar se a tabela existe
  const tabelaExiste = await verificarTabela();
  if (!tabelaExiste) {
    process.exit(1);
  }
  
  // Iniciar importação
  await importarBibliaParaSupabase();
}

// Executar script
main().catch(console.error);  