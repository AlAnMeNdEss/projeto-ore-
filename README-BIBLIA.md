# 📖 API da Bíblia - 100% Local

Esta API da Bíblia funciona **100% localmente** sem depender de nenhuma API externa. Todos os dados vêm do arquivo `public/pt_nvi.json` (Nova Versão Internacional em português).

## 🚀 Como usar

### 1. Iniciar a API
```bash
node api-biblia.js
```

A API estará disponível em `http://localhost:3001`

### 2. Testar a API
```bash
node test-biblia-local.js
```

## 📚 Endpoints disponíveis

### 1. Status da API
```http
GET /api/biblia/status
```

**Resposta:**
```json
{
  "status": "ok",
  "message": "API da Bíblia funcionando corretamente",
  "livros_carregados": 66,
  "fonte": "Local (pt_nvi.json)",
  "timestamp": "2025-07-26T14:16:30.772Z"
}
```

### 2. Listar todos os livros
```http
GET /api/biblia/livros
```

**Resposta:**
```json
{
  "total": 66,
  "livros": [
    {
      "abbrev": "gn",
      "book": "Gênesis",
      "capitulos": 50
    },
    {
      "abbrev": "ex",
      "book": "Êxodo", 
      "capitulos": 40
    }
    // ... todos os 66 livros
  ]
}
```

### 3. Buscar versículos por livro e capítulo
```http
GET /api/biblia?livro=Salmos&capitulo=23
```

**Resposta:**
```json
[
  {
    "versiculo": "1",
    "texto": "O Senhor é o meu pastor; de nada terei falta."
  },
  {
    "versiculo": "2", 
    "texto": "Em verdes pastagens me faz repousar e me conduz a águas tranqüilas;"
  }
  // ... todos os versículos do capítulo
]
```

### 4. Busca por palavra-chave
```http
GET /api/biblia/busca?termo=amor
```

**Resposta:**
```json
{
  "termo": "amor",
  "total_encontrado": 491,
  "resultados": [
    {
      "versiculo": "16",
      "texto": "como também os jebuseus, os amorreus, os girgaseus...",
      "livro": "Gênesis",
      "capitulo": 10
    }
    // ... até 100 resultados (limitado)
  ],
  "limitado": true
}
```

### 5. Informações de um livro específico
```http
GET /api/biblia/livro/Salmos
```

**Resposta:**
```json
{
  "abbrev": "sl",
  "book": "Salmos",
  "capitulos": 150,
  "primeiro_versiculo": "Como é feliz aquele que não segue o conselho dos ímpios..."
}
```

## 🔍 Funcionalidades

### ✅ Normalização de nomes
A API aceita diferentes formas de escrever os nomes dos livros:

- `genesis`, `GÊNESIS`, `Genesis` → `Gênesis`
- `joao`, `JOÃO`, `Joao` → `João`
- `1samuel`, `1 Samuel`, `1SAMUEL` → `1 Samuel`
- `salmos`, `SALMOS`, `Salmos` → `Salmos`

### ✅ Busca inteligente
- Busca por palavra-chave em todos os 66 livros
- Resultados limitados a 100 para performance
- Informações completas: livro, capítulo, versículo e texto

### ✅ Validação robusta
- Verifica se o livro existe
- Verifica se o capítulo existe
- Mensagens de erro claras e úteis

## 📊 Estatísticas

- **66 livros** da Bíblia completa
- **1.189 capítulos** no total
- **31.102 versículos** aproximadamente
- **Tradução**: Nova Versão Internacional (NVI)
- **Idioma**: Português

## 🔧 Integração com o Frontend

O componente `Biblia.tsx` já está configurado para usar esta API local. As URLs são:

```typescript
// Buscar versículos
const url = `http://localhost:3001/api/biblia?livro=${livro}&capitulo=${capitulo}`;

// Busca por palavra-chave  
const url = `http://localhost:3001/api/biblia/busca?termo=${termo}`;
```

## 🎯 Vantagens da API Local

### ✅ Sem dependências externas
- Não precisa de chaves de API
- Não depende de serviços online
- Funciona offline

### ✅ Performance
- Resposta instantânea
- Sem latência de rede
- Dados sempre disponíveis

### ✅ Privacidade
- Dados ficam no seu servidor
- Sem rastreamento externo
- Controle total dos dados

### ✅ Confiabilidade
- Sem limites de requisições
- Sem downtime de APIs externas
- Sem mudanças inesperadas

## 🚀 Como adicionar novas traduções

Para adicionar outras traduções:

1. **Adicione o arquivo JSON** na pasta `public/`
   - Exemplo: `public/pt_aa.json` (Almeida Atualizada)
   - Exemplo: `public/pt_arc.json` (Almeida Revista e Corrigida)

2. **Modifique a API** para suportar múltiplas traduções:
   ```javascript
   // Adicione um parâmetro de tradução
   const { livro, capitulo, traducao = 'nvi' } = req.query;
   
   // Carregue o arquivo correto
   const bibliaPath = path.join(__dirname, 'public', `pt_${traducao}.json`);
   ```

3. **Atualize o frontend** para permitir escolher tradução

## 🧪 Testes

Execute os testes completos:

```bash
node test-biblia-local.js
```

Isso testará:
- ✅ Status da API
- ✅ Listagem de livros (66 livros)
- ✅ Busca de versículos específicos
- ✅ Busca por palavra-chave
- ✅ Normalização de nomes
- ✅ Informações de livros

## 📝 Exemplos de uso

### Buscar João 3:16
```bash
curl "http://localhost:3001/api/biblia?livro=João&capitulo=3"
```

### Buscar versículos com "amor"
```bash
curl "http://localhost:3001/api/biblia/busca?termo=amor"
```

### Listar todos os livros
```bash
curl "http://localhost:3001/api/biblia/livros"
```

### Verificar status
```bash
curl "http://localhost:3001/api/biblia/status"
```

## 🎉 Resultado

Agora você tem uma **API da Bíblia 100% local** que:

- ✅ Funciona sem internet
- ✅ Não precisa de chaves de API
- ✅ É super rápida
- ✅ Tem todos os 66 livros
- ✅ Suporta busca por palavra-chave
- ✅ Normaliza nomes de livros
- ✅ É totalmente confiável

**Pronto para usar no seu app! 🚀** 