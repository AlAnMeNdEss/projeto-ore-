# 📖 API da Bíblia - Nova Configuração

## 🔑 Nova Chave de API

A API da Bíblia foi atualizada com a nova chave:
```
097696d2b8a85d86a19c8f37ce1fc342
```

## 🚀 Como Usar

### 1. Iniciar a API Local

```bash
# Iniciar a API da Bíblia
node api-biblia.js

# A API estará disponível em: http://localhost:3001
```

### 2. Testar a API

```bash
# Testar a nova configuração
node test-bible-api.js

# Verificar status da API
curl http://localhost:3001/api/biblia/status
```

## 📡 Endpoints Disponíveis

### Buscar Versículos
```
GET /api/biblia?livro=João&capitulo=3&traducao=almeida_ra
```

**Parâmetros:**
- `livro`: Nome do livro (ex: João, Salmos, Gênesis)
- `capitulo`: Número do capítulo
- `traducao`: Tradução desejada (padrão: almeida_ra)

**Resposta:**
```json
[
  {
    "versiculo": "16",
    "texto": "Porque Deus amou o mundo de tal maneira..."
  }
]
```

### Buscar por Palavra-chave
```
GET /api/biblia/busca?termo=amor&traducao=almeida_ra
```

**Parâmetros:**
- `termo`: Palavra ou frase para buscar
- `traducao`: Tradução desejada

### Listar Traduções
```
GET /api/biblia/traducoes
```

### Verificar Status
```
GET /api/biblia/status
```

## 📚 Traduções Disponíveis

### Português
- `almeida_ra` - Almeida Revista e Atualizada
- `almeida_rc` - Almeida Revista e Corrigida
- `blivre` - Bíblia Livre

### Inglês
- `kjv` - King James Version
- `kjv_strongs` - KJV com Strongs
- `asv` - American Standard Version
- `geneva` - Geneva Bible
- `web` - World English Bible
- `bishops` - Bishops Bible
- `coverdale` - Coverdale Bible
- `tyndale` - Tyndale Bible

## 🔧 Configuração

### Variáveis de Ambiente
```javascript
const BIBLE_API_KEY = '097696d2b8a85d86a19c8f37ce1fc342';
const SUPABASE_URL = 'https://fidiulbnuucqfckozbrv.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### CORS
A API está configurada para aceitar requisições de qualquer origem:
```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
```

## 🧪 Testes

### Teste Automático
```bash
node test-bible-api.js
```

### Teste Manual
```bash
# Testar busca de versículo
curl "http://localhost:3001/api/biblia?livro=João&capitulo=3&traducao=almeida_ra"

# Testar busca por palavra
curl "http://localhost:3001/api/biblia/busca?termo=amor&traducao=almeida_ra"

# Verificar status
curl "http://localhost:3001/api/biblia/status"
```

## 📱 Integração com o App

O componente `Biblia.tsx` foi atualizado para usar a nova API local:

```typescript
// Buscar versículos
const url = `http://localhost:3001/api/biblia?livro=${encodeURIComponent(livro)}&capitulo=${capitulo}&traducao=${traducao}`;

// Buscar por palavra-chave
const url = `http://localhost:3001/api/biblia/busca?termo=${encodeURIComponent(busca.trim())}&traducao=${traducao}`;
```

## 🐛 Solução de Problemas

### Problema: API não responde
**Solução:**
1. Verificar se a API está rodando: `node api-biblia.js`
2. Verificar se a porta 3001 está livre
3. Verificar se a chave da API está correta

### Problema: Erro de CORS
**Solução:**
- A API já está configurada com CORS habilitado
- Verificar se está acessando via `http://localhost:3001`

### Problema: Tradução não encontrada
**Solução:**
1. Verificar se o código da tradução está correto
2. Usar `GET /api/biblia/traducoes` para listar traduções disponíveis
3. Verificar se o livro existe na tradução escolhida

### Problema: Livro não encontrado
**Solução:**
- Verificar se o nome do livro está correto
- Algumas traduções podem usar nomes diferentes (ex: "Salmos" vs "Psalms")

## 📊 Status dos Testes

✅ **API funcionando corretamente**
- Busca de versículos: OK
- Busca por palavra-chave: OK
- Traduções em português: OK
- Traduções em inglês: OK (exceto KJV para livros em português)

## 🔄 Próximos Passos

1. **Deploy da API**: Configurar para produção
2. **Cache**: Implementar cache para melhor performance
3. **Rate Limiting**: Adicionar limitação de requisições
4. **Logs**: Implementar sistema de logs
5. **Monitoramento**: Adicionar métricas de uso

## 📞 Suporte

Para problemas com a API da Bíblia:
- Verificar logs da API
- Testar com `node test-bible-api.js`
- Verificar status com `GET /api/biblia/status`

---

**📖 Ore+** - Fortalecendo sua jornada espiritual através da tecnologia ✨ 