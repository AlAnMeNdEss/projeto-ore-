// Script para diagnosticar problemas com mensagens
console.log('=== DIAGNÓSTICO DO SISTEMA DE MENSAGENS ===');

// Verificar se o Supabase está configurado
try {
  const { createClient } = require('@supabase/supabase-js');
  console.log('✅ Supabase client disponível');
} catch (error) {
  console.log('❌ Erro ao importar Supabase:', error);
}

// Verificar localStorage
try {
  const testKey = 'test_messages_debug';
  localStorage.setItem(testKey, 'test');
  const testValue = localStorage.getItem(testKey);
  localStorage.removeItem(testKey);
  console.log('✅ localStorage funcionando:', testValue === 'test');
} catch (error) {
  console.log('❌ localStorage não funciona:', error);
}

// Verificar se há mensagens salvas
const savedMessages = [];
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key && key.startsWith('messages_')) {
    try {
      const messages = JSON.parse(localStorage.getItem(key));
      savedMessages.push({ key, count: messages.length });
    } catch (error) {
      console.log('❌ Erro ao ler mensagens de', key, error);
    }
  }
}

console.log('📱 Mensagens salvas no localStorage:', savedMessages);

// Verificar configuração do Supabase
console.log('🔧 Configuração do Supabase:');
console.log('- URL:', process.env.VITE_SUPABASE_URL || 'Não definida');
console.log('- Key:', process.env.VITE_SUPABASE_ANON_KEY ? 'Definida' : 'Não definida');

console.log('=== FIM DO DIAGNÓSTICO ==='); 