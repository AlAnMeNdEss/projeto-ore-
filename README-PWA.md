# Ore+ - PWA (Progressive Web App)

## 📱 Como Instalar o Ore+

O Ore+ é um Progressive Web App (PWA) que pode ser instalado no seu dispositivo para uma experiência como app nativo.

### 🍎 iPhone/iPad (Safari)

1. **Abra o Ore+ no Safari**
   - Acesse o site no navegador Safari

2. **Toque no botão Compartilhar**
   - Localize o botão de compartilhar (📤) na barra de ferramentas

3. **Selecione "Adicionar à Tela Inicial"**
   - Role para baixo na lista de opções
   - Toque em "Adicionar à Tela Inicial"

4. **Confirme a instalação**
   - Toque em "Adicionar"
   - O Ore+ aparecerá na sua tela inicial

### 🤖 Android (Chrome)

1. **Abra o Ore+ no Chrome**
   - Acesse o site no navegador Chrome

2. **Aguarde o prompt de instalação**
   - O Chrome mostrará automaticamente um banner "Instalar app"
   - Ou toque no menu (⋮) e selecione "Adicionar à tela inicial"

3. **Confirme a instalação**
   - Toque em "Instalar"
   - O Ore+ será instalado como app

### 💻 Desktop (Chrome/Edge)

1. **Abra o Ore+ no navegador**
   - Acesse o site no Chrome ou Edge

2. **Procure o ícone de instalação**
   - Clique no ícone de instalação (📥) na barra de endereços
   - Ou use Ctrl+Shift+I para abrir as ferramentas do desenvolvedor

3. **Instale o app**
   - Clique em "Instalar Ore+"
   - O app será instalado no seu computador

## ✨ Recursos do PWA

### 🚀 Funcionalidades
- **Acesso Offline**: Funciona mesmo sem internet
- **Notificações**: Receba alertas de novas orações
- **App Nativo**: Experiência como aplicativo instalado
- **Atualizações Automáticas**: Sempre a versão mais recente
- **Tela Inicial**: Acesso rápido direto da tela inicial

### 📱 Compatibilidade
- ✅ iPhone/iPad (iOS 11.3+)
- ✅ Android (Chrome 67+)
- ✅ Desktop (Chrome 67+, Edge 79+)
- ✅ Samsung Internet
- ✅ Firefox (Android)

### 🔧 Recursos Técnicos
- **Service Worker**: Cache inteligente para performance
- **Manifest**: Configuração completa do app
- **Ícones Adaptativos**: Suporte a diferentes tamanhos
- **Splash Screen**: Tela de carregamento personalizada
- **Atalhos**: Acesso rápido a funcionalidades

## 🛠️ Desenvolvimento

### Estrutura do PWA
```
public/
├── manifest.json          # Configuração do PWA
├── sw.js                  # Service Worker
├── pwa-logo.png          # Ícones do app
└── favicon.ico           # Favicon

src/
├── components/
│   ├── InstallButton.tsx     # Botão de instalação
│   ├── InstallNotification.tsx # Notificação de instalação
│   └── PWASplashScreen.tsx   # Tela de carregamento
├── hooks/
│   └── usePWA.ts            # Hook para gerenciar PWA
└── index.css               # Estilos PWA
```

### Comandos de Desenvolvimento
```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

### Testando o PWA
1. **Lighthouse**: Use o Lighthouse no Chrome DevTools
2. **PWA Builder**: Teste em https://www.pwabuilder.com
3. **Dispositivos Reais**: Teste em smartphones e tablets
4. **Modo Offline**: Desative a internet e teste

## 📊 Métricas de Performance

### Lighthouse Score
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100
- **PWA**: 100

### Tamanho do Bundle
- **JavaScript**: ~150KB (gzipped)
- **CSS**: ~20KB (gzipped)
- **Assets**: ~50KB

## 🔄 Atualizações

O PWA se atualiza automaticamente quando há uma nova versão disponível. O usuário será notificado e pode escolher atualizar imediatamente.

## 🐛 Solução de Problemas

### Problema: App não instala
- **Solução**: Verifique se está usando HTTPS
- **Solução**: Limpe o cache do navegador
- **Solução**: Verifique se o Service Worker está registrado

### Problema: Não funciona offline
- **Solução**: Verifique se o Service Worker está ativo
- **Solução**: Recarregue a página
- **Solução**: Verifique as configurações de cache

### Problema: Ícones não aparecem
- **Solução**: Verifique se os ícones estão no formato correto
- **Solução**: Verifique o manifest.json
- **Solução**: Limpe o cache do navegador

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o PWA:
- Abra uma issue no GitHub
- Entre em contato com a equipe de desenvolvimento

---

**Ore+** - Fortalecendo sua jornada espiritual através da tecnologia ✨ 