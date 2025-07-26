#!/usr/bin/env node

/**
 * Script para debugar problemas de instalação do PWA
 * Execute: node debug-pwa-installation.js
 */

import fs from 'fs';
import path from 'path';

console.log('🔍 Debugando problemas de instalação do PWA...\n');

// Verificar requisitos básicos
console.log('📋 VERIFICANDO REQUISITOS BÁSICOS:');
console.log('='.repeat(50));

// 1. Verificar se está rodando em HTTPS
console.log('1️⃣ HTTPS é obrigatório para PWA');
console.log('   - Se estiver rodando localmente, use: npm run dev -- --https');
console.log('   - Ou configure um proxy HTTPS\n');

// 2. Verificar manifest.json
console.log('2️⃣ Verificando manifest.json...');
try {
  const manifest = JSON.parse(fs.readFileSync('public/manifest.json', 'utf8'));
  
  const requiredFields = {
    name: 'Nome do app',
    short_name: 'Nome curto',
    start_url: 'URL de início',
    display: 'Modo de exibição',
    background_color: 'Cor de fundo',
    theme_color: 'Cor do tema',
    icons: 'Ícones'
  };
  
  let manifestScore = 0;
  Object.entries(requiredFields).forEach(([field, description]) => {
    if (manifest[field]) {
      console.log(`   ✅ ${description}: ${manifest[field]}`);
      manifestScore++;
    } else {
      console.log(`   ❌ ${description}: AUSENTE`);
    }
  });
  
  // Verificar ícones
  if (manifest.icons && manifest.icons.length > 0) {
    console.log(`   ✅ ${manifest.icons.length} ícones configurados`);
    manifestScore++;
    
    // Verificar se os ícones existem
    manifest.icons.forEach((icon, index) => {
      const iconPath = icon.src.startsWith('/') ? icon.src.slice(1) : icon.src;
      if (fs.existsSync(iconPath)) {
        console.log(`      ✅ Ícone ${index + 1}: ${icon.sizes} existe`);
      } else {
        console.log(`      ❌ Ícone ${index + 1}: ${icon.sizes} NÃO EXISTE (${iconPath})`);
      }
    });
  } else {
    console.log('   ❌ Nenhum ícone configurado');
  }
  
  console.log(`   📊 Score do manifest: ${manifestScore}/${Object.keys(requiredFields).length + 1}\n`);
  
} catch (error) {
  console.log('   ❌ Erro ao ler manifest.json:', error.message, '\n');
}

// 3. Verificar service worker
console.log('3️⃣ Verificando service worker...');
try {
  const swContent = fs.readFileSync('public/sw.js', 'utf8');
  
  const swFeatures = {
    'install': 'Evento install',
    'activate': 'Evento activate', 
    'fetch': 'Evento fetch',
    'CACHE_NAME': 'Nome do cache',
    'caches.open': 'API de cache',
    'skipWaiting': 'Skip waiting'
  };
  
  let swScore = 0;
  Object.entries(swFeatures).forEach(([feature, description]) => {
    if (swContent.includes(feature)) {
      console.log(`   ✅ ${description}`);
      swScore++;
    } else {
      console.log(`   ❌ ${description}: AUSENTE`);
    }
  });
  
  console.log(`   📊 Score do service worker: ${swScore}/${Object.keys(swFeatures).length}\n`);
  
} catch (error) {
  console.log('   ❌ Erro ao ler service worker:', error.message, '\n');
}

// 4. Verificar HTML
console.log('4️⃣ Verificando HTML...');
try {
  const htmlContent = fs.readFileSync('index.html', 'utf8');
  
  const htmlFeatures = {
    'manifest.json': 'Link para manifest',
    'sw.js': 'Registro do service worker',
    'apple-mobile-web-app-capable': 'Meta tag iOS',
    'theme-color': 'Cor do tema',
    'viewport': 'Viewport responsivo',
    'beforeinstallprompt': 'Evento de instalação'
  };
  
  let htmlScore = 0;
  Object.entries(htmlFeatures).forEach(([feature, description]) => {
    if (htmlContent.includes(feature)) {
      console.log(`   ✅ ${description}`);
      htmlScore++;
    } else {
      console.log(`   ❌ ${description}: AUSENTE`);
    }
  });
  
  console.log(`   📊 Score do HTML: ${htmlScore}/${Object.keys(htmlFeatures).length}\n`);
  
} catch (error) {
  console.log('   ❌ Erro ao ler HTML:', error.message, '\n');
}

// 5. Verificar componentes React
console.log('5️⃣ Verificando componentes React...');
const reactComponents = [
  'src/components/InstallButton.tsx',
  'src/components/InstallNotification.tsx',
  'src/components/PWASplashScreen.tsx',
  'src/hooks/usePWA.ts'
];

let reactScore = 0;
reactComponents.forEach(component => {
  if (fs.existsSync(component)) {
    console.log(`   ✅ ${component}`);
    reactScore++;
  } else {
    console.log(`   ❌ ${component}: NÃO ENCONTRADO`);
  }
});

console.log(`   📊 Score dos componentes: ${reactScore}/${reactComponents.length}\n`);

// 6. Problemas comuns
console.log('6️⃣ PROBLEMAS COMUNS E SOLUÇÕES:');
console.log('='.repeat(50));

const commonProblems = [
  {
    problem: 'PWA não aparece como instalável',
    solutions: [
      'Verificar se está rodando em HTTPS',
      'Verificar se o manifest.json está acessível',
      'Verificar se o service worker está registrado',
      'Limpar cache do navegador',
      'Verificar se não está já instalado'
    ]
  },
  {
    problem: 'Botão de instalação não aparece',
    solutions: [
      'Verificar se o evento beforeinstallprompt está sendo capturado',
      'Verificar se o hook usePWA está funcionando',
      'Verificar se não está em modo standalone',
      'Verificar logs no console do navegador'
    ]
  },
  {
    problem: 'Instalação falha',
    solutions: [
      'Verificar se todos os ícones existem',
      'Verificar se o manifest.json é válido',
      'Verificar se o service worker está funcionando',
      'Testar em navegador diferente'
    ]
  },
  {
    problem: 'PWA não funciona offline',
    solutions: [
      'Verificar se o service worker está cacheando recursos',
      'Verificar se a estratégia de cache está correta',
      'Verificar se os recursos estão sendo interceptados'
    ]
  }
];

commonProblems.forEach((item, index) => {
  console.log(`${index + 1}. ${item.problem}:`);
  item.solutions.forEach(solution => {
    console.log(`   • ${solution}`);
  });
  console.log('');
});

// 7. Comandos para testar
console.log('7️⃣ COMANDOS PARA TESTAR:');
console.log('='.repeat(50));

console.log('📱 Para testar em desenvolvimento:');
console.log('   npm run dev -- --https');
console.log('   # Ou configure um proxy HTTPS\n');

console.log('🔍 Para debugar no navegador:');
console.log('   1. Abra DevTools (F12)');
console.log('   2. Vá para aba Application');
console.log('   3. Verifique Manifest e Service Workers');
console.log('   4. Use o Lighthouse para audit PWA\n');

console.log('📊 Para validar com Lighthouse:');
console.log('   1. Abra DevTools (F12)');
console.log('   2. Vá para aba Lighthouse');
console.log('   3. Selecione "Progressive Web App"');
console.log('   4. Clique em "Generate report"\n');

console.log('🧪 Para testar instalação:');
console.log('   1. Abra o site no Chrome/Edge');
console.log('   2. Procure o ícone de instalação na barra de endereços');
console.log('   3. Ou use o botão "Instalar" no app');
console.log('   4. Para iOS: use Safari e "Adicionar à Tela Inicial"\n');

console.log('✨ Debug concluído!');
console.log('💡 Use o componente PWADebug no app para mais informações em tempo real.'); 