# Silent Prayers - Comunidade de Oração

Uma aplicação moderna de oração compartilhada com design mobile-first e experiência nativa.

## 🚀 Características

### ✨ Design Mobile Moderno
- **Interface nativa**: Design inspirado em apps mobile modernos
- **Animações suaves**: Transições e efeitos visuais fluidos
- **Touch-friendly**: Otimizado para interação por toque
- **Responsivo**: Adapta-se perfeitamente a diferentes tamanhos de tela

### 📱 Experiência Mobile
- **Navegação por abas**: Interface intuitiva com navegação inferior
- **Cards modernos**: Design de cartões com glassmorphism
- **Botões flutuantes**: Ações principais facilmente acessíveis
- **Safe areas**: Suporte para dispositivos com notch
- **PWA**: Instalável como app nativo

### 🙏 Funcionalidades de Oração
- **Pedidos de oração**: Compartilhe suas necessidades
- **Comunidade global**: Conecte-se com outros fiéis
- **Bíblia integrada**: Leia e pesquise versículos
- **Testemunhos**: Compartilhe experiências de fé
- **Grupos privados**: Crie comunidades específicas

### 🎨 Design System
- **Cores modernas**: Paleta de cores mobile-first
- **Tipografia responsiva**: Escalas de texto otimizadas
- **Componentes reutilizáveis**: Sistema de design consistente
- **Efeitos visuais**: Sombras, blur e gradientes modernos

## 🛠️ Tecnologias

- **React 18** com TypeScript
- **Tailwind CSS** com design system customizado
- **Framer Motion** para animações
- **Supabase** para backend e autenticação
- **PWA** com service workers
- **Lucide React** para ícones

## 📱 Melhorias Mobile Implementadas

### Interface
- ✅ Barra de navegação inferior moderna
- ✅ Cards com glassmorphism
- ✅ Botões com efeitos de toque
- ✅ Animações de entrada e saída
- ✅ Status bar mobile
- ✅ Safe areas para dispositivos com notch

### Interação
- ✅ Efeitos de ripple nos botões
- ✅ Transições suaves
- ✅ Feedback visual imediato
- ✅ Gestos de swipe
- ✅ Scroll otimizado para touch

### Performance
- ✅ Lazy loading de componentes
- ✅ Animações otimizadas
- ✅ Código dividido (code splitting)
- ✅ Cache inteligente

### Acessibilidade
- ✅ Navegação por teclado
- ✅ Screen readers
- ✅ Contraste adequado
- ✅ Tamanhos de toque apropriados

## 🚀 Como Executar

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/silent-prayers-shared-2.git
cd silent-prayers-shared-2
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp env.example .env.local
# Edite o arquivo .env.local com suas credenciais do Supabase
```

4. **Execute o projeto**
```bash
npm run dev
```

5. **Acesse no navegador**
```
http://localhost:5173
```

## 📱 Instalação PWA

### Android/Chrome
1. Abra o site no Chrome
2. Toque no ícone de instalação na barra de endereços
3. Confirme a instalação

### iOS/Safari
1. Abra o site no Safari
2. Toque no botão "Compartilhar"
3. Selecione "Adicionar à Tela Inicial"
4. Confirme a instalação

## 🎨 Componentes Mobile

### Cards
```tsx
<div className="mobile-card p-6">
  {/* Conteúdo do card */}
</div>
```

### Botões
```tsx
<button className="mobile-button-primary">
  Botão Principal
</button>

<button className="mobile-button-secondary">
  Botão Secundário
</button>

<button className="mobile-button-floating">
  Botão Flutuante
</button>
```

### Navegação
```tsx
<BottomNavBar 
  activeTab={activeTab} 
  setActiveTab={setActiveTab} 
/>
```

### Modais
```tsx
<div className="mobile-modal">
  <div className="mobile-modal-content">
    {/* Conteúdo do modal */}
  </div>
</div>
```

## 📊 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── BottomNavBar.tsx # Navegação inferior
│   ├── HomePage.tsx    # Página inicial
│   └── ...
├── pages/              # Páginas da aplicação
├── hooks/              # Hooks customizados
├── types/              # Definições de tipos
├── lib/                # Utilitários
└── index.css           # Estilos globais e design system
```

## 🎯 Próximas Melhorias

- [ ] Modo escuro automático
- [ ] Notificações push
- [ ] Sincronização offline
- [ ] Compartilhamento de versículos
- [ ] Áudio de orações
- [ ] Calendário de eventos
- [ ] Integração com redes sociais

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- Comunidade de oração que inspira este projeto
- Contribuidores e testadores
- Tecnologias open source que tornam isso possível

---

**Silent Prayers** - Conectando corações através da oração 🙏✨
