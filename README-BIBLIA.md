# Sistema de Busca da Bíblia - Híbrido

## Como Funciona

O sistema de busca da Bíblia funciona em 3 níveis:

### 1. 🔗 API Externa (Primeira opção)
- Tenta buscar na API bible-api.com
- Busca real em toda a Bíblia
- Requer internet
- Pode ter limites de requisições

### 2. 📖 Bíblia Completa Local (Segunda opção)
- Carrega arquivo JSON local
- Busca completa offline
- Requer arquivo `biblia-completa.json` na pasta `public/`
- Performance limitada a 20 resultados

### 3. 📚 Versículos Selecionados (Terceira opção)
- Lista pré-definida de versículos populares
- Sempre disponível
- Palavras-chave: amor, fé, esperança, conforto, gratidão, paz

## Como Adicionar a Bíblia Completa

### Opção 1: Download Manual
1. Baixe um arquivo JSON da Bíblia completa
2. Renomeie para `biblia-completa.json`
3. Coloque na pasta `public/` do projeto

### Opção 2: Usar Repositório GitHub
```bash
# Exemplo de repositório com Bíblia em JSON
# https://github.com/bibleapi/bibleapi-bibles-json
```

### Formato Esperado do JSON
```json
[
  {
    "name": "Gênesis",
    "chapters": [
      {
        "verses": [
          {
            "verse": 1,
            "text": "No princípio criou Deus os céus e a terra."
          }
        ]
      }
    ]
  }
]
```

## Vantagens do Sistema Híbrido

✅ **Sempre funciona** - Pelo menos uma opção disponível  
✅ **Performance otimizada** - Carregamento sob demanda  
✅ **Flexibilidade** - Funciona com ou sem internet  
✅ **Escalabilidade** - Pode adicionar mais fontes facilmente  

## Indicadores Visuais

- 🔗 **Buscando na API** - Usando API externa
- 📖 **Bíblia completa local** - Usando arquivo JSON local
- 📚 **Versículos selecionados** - Usando lista pré-definida
- ⏳ **Carregando...** - Processando busca

## Recomendações

1. **Para desenvolvimento**: Use apenas versículos selecionados
2. **Para produção**: Adicione a Bíblia completa local
3. **Para máxima compatibilidade**: Mantenha as 3 opções 