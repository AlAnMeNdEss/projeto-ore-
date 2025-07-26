#!/usr/bin/env node

/**
 * Script para testar a funcionalidade do PWA
 * Execute: node test-pwa.js
 */

import fs from 'fs';
import path from 'path';

console.log('🔍 Testando funcionalidade do PWA Ore+...\n');

// Verificar se os arquivos essenciais existem
const requiredFiles = [
  'public/manifest.json',
  'public/sw.js',
  'public/pwa-logo.png',
  'index.html'
];

console.log('📁 Verificando arquivos essenciais:');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - ARQUIVO NÃO ENCONTRADO`);
  }
});

// Verificar manifest.json
console.log('\n📋 Verificando manifest.json:');
try {
  const manifest = JSON.parse(fs.readFileSync('public/manifest.json', 'utf8'));
  
  const requiredFields = [
    'name',
    'short_name',
    'start_url',
    'display',
    'background_color',
    'theme_color',
    'icons'
  ];
  
  requiredFields.forEach(field => {
    if (manifest[field]) {
      console.log(`✅ ${field}: ${manifest[field]}`);
    } else {
      console.log(`❌ ${field}: CAMPO OBRIGATÓRIO AUSENTE`);
    }
  });
  
  // Verificar ícones
  if (manifest.icons && manifest.icons.length > 0) {
    console.log(`✅ ${manifest.icons.length} ícones configurados`);
    manifest.icons.forEach((icon, index) => {
      if (icon.src && icon.sizes) {
        console.log(`  - Ícone ${index + 1}: ${icon.sizes} (${icon.src})`);
      }
    });
  } else {
    console.log('❌ Nenhum ícone configurado');
  }
  
} catch (error) {
  console.log('❌ Erro ao ler manifest.json:', error.message);
}

// Verificar service worker
console.log('\n⚙️ Verificando service worker:');
try {
  const swContent = fs.readFileSync('public/sw.js', 'utf8');
  
  const requiredSWFeatures = [
    'install',
    'activate',
    'fetch',
    'CACHE_NAME'
  ];
  
  requiredSWFeatures.forEach(feature => {
    if (swContent.includes(feature)) {
      console.log(`✅ ${feature} implementado`);
    } else {
      console.log(`❌ ${feature} não encontrado`);
    }
  });
  
} catch (error) {
  console.log('❌ Erro ao ler service worker:', error.message);
}

// Verificar HTML
console.log('\n🌐 Verificando HTML:');
try {
  const htmlContent = fs.readFileSync('index.html', 'utf8');
  
  const requiredHTMLFeatures = [
    'manifest.json',
    'sw.js',
    'apple-mobile-web-app-capable',
    'theme-color',
    'viewport'
  ];
  
  requiredHTMLFeatures.forEach(feature => {
    if (htmlContent.includes(feature)) {
      console.log(`✅ ${feature} configurado`);
    } else {
      console.log(`❌ ${feature} não encontrado`);
    }
  });
  
} catch (error) {
  console.log('❌ Erro ao ler HTML:', error.message);
}

// Verificar componentes React
console.log('\n⚛️ Verificando componentes React:');
const reactComponents = [
  'src/components/InstallButton.tsx',
  'src/components/InstallNotification.tsx',
  'src/components/PWASplashScreen.tsx',
  'src/hooks/usePWA.ts'
];

reactComponents.forEach(component => {
  if (fs.existsSync(component)) {
    console.log(`✅ ${component}`);
  } else {
    console.log(`❌ ${component} - COMPONENTE NÃO ENCONTRADO`);
  }
});

// Verificar configuração do Vite
console.log('\n⚡ Verificando configuração do Vite:');
try {
  const viteConfig = fs.readFileSync('vite.config.ts', 'utf8');
  
  if (viteConfig.includes('build')) {
    console.log('✅ Configuração de build encontrada');
  } else {
    console.log('❌ Configuração de build não encontrada');
  }
  
} catch (error) {
  console.log('❌ Erro ao ler vite.config.ts:', error.message);
}

// Resumo
console.log('\n📊 RESUMO DO TESTE:');
console.log('='.repeat(50));

const testResults = {
  files: requiredFiles.filter(f => fs.existsSync(f)).length,
  totalFiles: requiredFiles.length,
  manifest: fs.existsSync('public/manifest.json'),
  serviceWorker: fs.existsSync('public/sw.js'),
  components: reactComponents.filter(f => fs.existsSync(f)).length,
  totalComponents: reactComponents.length
};

console.log(`📁 Arquivos essenciais: ${testResults.files}/${testResults.totalFiles}`);
console.log(`📋 Manifest: ${testResults.manifest ? '✅' : '❌'}`);
console.log(`⚙️ Service Worker: ${testResults.serviceWorker ? '✅' : '❌'}`);
console.log(`⚛️ Componentes React: ${testResults.components}/${testResults.totalComponents}`);

const score = Math.round((testResults.files + (testResults.manifest ? 1 : 0) + (testResults.serviceWorker ? 1 : 0) + testResults.components) / (testResults.totalFiles + 2 + testResults.totalComponents) * 100);

console.log(`\n🎯 Score geral: ${score}%`);

if (score >= 90) {
  console.log('🎉 PWA configurado corretamente!');
} else if (score >= 70) {
  console.log('⚠️ PWA quase pronto, alguns ajustes necessários.');
} else {
  console.log('❌ PWA precisa de mais configurações.');
}

console.log('\n📝 Próximos passos:');
console.log('1. Execute: npm run build');
console.log('2. Teste em um servidor HTTPS');
console.log('3. Use o Lighthouse para validação');
console.log('4. Teste em dispositivos móveis');

console.log('\n✨ Teste concluído!'); 