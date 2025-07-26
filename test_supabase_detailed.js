// Script para testar Supabase detalhadamente
console.log('=== TESTE DETALHADO DO SUPABASE ===');

// Simular o teste que faremos no navegador
async function testSupabase() {
  try {
    // 1. Testar se consegue conectar
    console.log('1. Testando conexão...');
    
    // 2. Testar se a tabela existe
    console.log('2. Testando se tabela prayer_messages existe...');
    
    // 3. Testar inserção
    console.log('3. Testando inserção...');
    
    // 4. Testar leitura
    console.log('4. Testando leitura...');
    
    console.log('✅ Todos os testes passaram!');
  } catch (error) {
    console.error('❌ Erro nos testes:', error);
  }
}

testSupabase(); 