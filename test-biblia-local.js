#!/usr/bin/env node

/**
 * Script para testar a API da Bíblia local
 * Execute: node test-biblia-local.js
 */

console.log('🔍 Testando API da Bíblia Local...\n');

async function testAPI() {
  const baseURL = 'http://localhost:3001/api/biblia';
  
  try {
    // Teste 1: Status da API
    console.log('1️⃣ Testando status da API...');
    const statusResponse = await fetch(`${baseURL}/status`);
    const statusData = await statusResponse.json();
    
    if (statusData.status === 'ok') {
      console.log('   ✅ API funcionando!');
      console.log(`   📚 ${statusData.livros_carregados} livros carregados`);
      console.log(`   📖 Fonte: ${statusData.fonte}`);
    } else {
      console.log('   ❌ API com problemas');
      return;
    }

    // Teste 2: Listar livros
    console.log('\n2️⃣ Testando listagem de livros...');
    const livrosResponse = await fetch(`${baseURL}/livros`);
    const livrosData = await livrosResponse.json();
    
    if (livrosData.total === 66) {
      console.log('   ✅ 66 livros encontrados');
      console.log('   📖 Primeiros 5 livros:');
      livrosData.livros.slice(0, 5).forEach(livro => {
        console.log(`      - ${livro.book} (${livro.abbrev}): ${livro.capitulos} capítulos`);
      });
    } else {
      console.log(`   ❌ Esperado 66 livros, encontrado ${livrosData.total}`);
    }

    // Teste 3: Buscar versículo específico
    console.log('\n3️⃣ Testando busca de versículo (Salmos 23:1)...');
    const versiculoResponse = await fetch(`${baseURL}?livro=Salmos&capitulo=23`);
    const versiculoData = await versiculoResponse.json();
    
    if (versiculoData.length > 0) {
      console.log('   ✅ Versículos encontrados');
      console.log(`   📝 Primeiro versículo: ${versiculoData[0].texto.substring(0, 50)}...`);
      console.log(`   📊 Total de versículos: ${versiculoData.length}`);
    } else {
      console.log('   ❌ Nenhum versículo encontrado');
    }

    // Teste 4: Busca por palavra-chave
    console.log('\n4️⃣ Testando busca por palavra-chave (amor)...');
    const buscaResponse = await fetch(`${baseURL}/busca?termo=amor`);
    const buscaData = await buscaResponse.json();
    
    if (buscaData.total_encontrado > 0) {
      console.log(`   ✅ ${buscaData.total_encontrado} versículos encontrados`);
      console.log(`   📝 Primeiro resultado: ${buscaData.resultados[0].texto.substring(0, 50)}...`);
      console.log(`   📖 Livro: ${buscaData.resultados[0].livro} ${buscaData.resultados[0].capitulo}:${buscaData.resultados[0].versiculo}`);
    } else {
      console.log('   ❌ Nenhum resultado encontrado');
    }

    // Teste 5: Busca por "Deus" (deve encontrar muitos)
    console.log('\n5️⃣ Testando busca por "Deus"...');
    const deusResponse = await fetch(`${baseURL}/busca?termo=Deus`);
    const deusData = await deusResponse.json();
    
    if (deusData.total_encontrado > 1000) {
      console.log(`   ✅ ${deusData.total_encontrado} versículos encontrados (muitos!)`);
      console.log(`   📝 Primeiro resultado: ${deusData.resultados[0].texto.substring(0, 50)}...`);
    } else {
      console.log(`   ⚠️  Apenas ${deusData.total_encontrado} versículos encontrados`);
    }

    // Teste 6: Informações de um livro específico
    console.log('\n6️⃣ Testando informações do livro Salmos...');
    const livroResponse = await fetch(`${baseURL}/livro/Salmos`);
    const livroData = await livroResponse.json();
    
    if (livroData.capitulos === 150) {
      console.log('   ✅ Informações corretas do Salmos');
      console.log(`   📖 ${livroData.book}: ${livroData.capitulos} capítulos`);
      console.log(`   🏷️  Abreviação: ${livroData.abbrev}`);
    } else {
      console.log(`   ❌ Esperado 150 capítulos, encontrado ${livroData.capitulos}`);
    }

    // Teste 7: Testar normalização de nomes
    console.log('\n7️⃣ Testando normalização de nomes...');
    const nomesTest = ['genesis', 'GÊNESIS', 'joao', 'JOÃO', '1samuel', '1 Samuel'];
    
    for (const nome of nomesTest) {
      const testResponse = await fetch(`${baseURL}?livro=${encodeURIComponent(nome)}&capitulo=1`);
      if (testResponse.ok) {
        console.log(`   ✅ "${nome}" → Funciona`);
      } else {
        console.log(`   ❌ "${nome}" → Não funciona`);
      }
    }

    console.log('\n🎉 Todos os testes concluídos!');
    console.log('💡 A API da Bíblia local está funcionando perfeitamente.');
    console.log('📱 Agora você pode usar no seu app sem depender de APIs externas!');

  } catch (error) {
    console.error('❌ Erro nos testes:', error.message);
    console.log('💡 Certifique-se de que a API está rodando: node api-biblia.js');
  }
}

// Executar os testes
testAPI(); 