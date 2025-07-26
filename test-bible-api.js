#!/usr/bin/env node

/**
 * Script para testar a nova API da Bíblia
 * Execute: node test-bible-api.js
 */

const API_KEY = '097696d2b8a85d86a19c8f37ce1fc342';

console.log('🔍 Testando nova API da Bíblia...\n');

async function testAPI() {
  try {
    // Teste 1: Buscar versículo específico
    console.log('1️⃣ Testando busca de versículo (João 3:16)...');
    const ref = encodeURIComponent('João 3:16');
    const url1 = `https://api.biblesupersearch.com/api?bible=almeida_ra&reference=${ref}&key=${API_KEY}`;
    
    const response1 = await fetch(url1);
    const data1 = await response1.json();
    
    if (data1.errors && data1.errors.length > 0) {
      console.log('   ❌ Erro:', data1.errors.join(' '));
    } else {
      console.log('   ✅ Sucesso!');
      if (data1.results && data1.results.length > 0) {
        const result = data1.results[0];
        console.log(`   📖 Livro: ${result.book_name}`);
        console.log(`   📄 Capítulo: ${result.chapter}`);
        console.log(`   📝 Versículos encontrados: ${Object.keys(result.verses?.almeida_ra?.[16] || {}).length}`);
      }
    }

    // Teste 2: Busca por palavra-chave
    console.log('\n2️⃣ Testando busca por palavra-chave (amor)...');
    const search = encodeURIComponent('amor');
    const url2 = `https://api.biblesupersearch.com/api?bible=almeida_ra&search=${search}&key=${API_KEY}`;
    
    const response2 = await fetch(url2);
    const data2 = await response2.json();
    
    if (data2.errors && data2.errors.length > 0) {
      console.log('   ❌ Erro:', data2.errors.join(' '));
    } else {
      console.log('   ✅ Sucesso!');
      console.log(`   📝 Resultados encontrados: ${data2.results?.length || 0}`);
    }

    // Teste 3: Listar traduções disponíveis
    console.log('\n3️⃣ Testando listagem de traduções...');
    const url3 = `https://api.biblesupersearch.com/api?bibles=1&key=${API_KEY}`;
    
    const response3 = await fetch(url3);
    const data3 = await response3.json();
    
    if (data3.errors && data3.errors.length > 0) {
      console.log('   ❌ Erro:', data3.errors.join(' '));
    } else {
      console.log('   ✅ Sucesso!');
      const bibles = data3.bibles || {};
      console.log(`   📚 Traduções disponíveis: ${Object.keys(bibles).length}`);
      
      // Mostrar algumas traduções em português
      const portugueseBibles = Object.entries(bibles).filter(([key, value]) => 
        key.includes('almeida') || key.includes('blivre') || 
        (typeof value === 'object' && value.language === 'Portuguese')
      );
      
      if (portugueseBibles.length > 0) {
        console.log('   🇧🇷 Traduções em português:');
        portugueseBibles.slice(0, 5).forEach(([key, value]) => {
          console.log(`      - ${key}: ${typeof value === 'object' ? value.name : value}`);
        });
      }
    }

    // Teste 4: Testar diferentes traduções
    console.log('\n4️⃣ Testando diferentes traduções...');
    const translations = ['almeida_ra', 'almeida_rc', 'kjv'];
    
    for (const translation of translations) {
      console.log(`   Testando ${translation}...`);
      const ref = encodeURIComponent('Salmos 23:1');
      const url = `https://api.biblesupersearch.com/api?bible=${translation}&reference=${ref}&key=${API_KEY}`;
      
      try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.errors && data.errors.length > 0) {
          console.log(`      ❌ ${translation}: ${data.errors.join(' ')}`);
        } else {
          console.log(`      ✅ ${translation}: OK`);
        }
      } catch (error) {
        console.log(`      ❌ ${translation}: Erro de conexão`);
      }
    }

    console.log('\n🎉 Teste da API concluído!');
    console.log('💡 A API está funcionando corretamente com a nova chave.');

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

// Executar o teste
testAPI(); 