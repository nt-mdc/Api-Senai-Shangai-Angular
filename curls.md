# 🧪 Curls para Teste — Tourism Spots API

> **Base URL:** `https://api-senai-angular.vercel.app/api`
>
> Substitua `{{TOKEN}}` pelo token JWT retornado no login.
> Substitua `{{SPOT_ID}}` pelo ID do ponto turístico criado.

---

## 1. Auth

### 1.1 Login

```bash
curl -X POST https://api-senai-angular.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@shanghai.com",
    "password": "admin123"
  }'
```

> ✅ Copie o `token` retornado e substitua `{{TOKEN}}` nos próximos curls.

---

### 1.2 Criar novo admin (🔒 requer token)

```bash
curl -X POST https://api-senai-angular.vercel.app/api/admin/admin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{TOKEN}}" \
  -d '{
    "name": "Novo Admin",
    "email": "novoadmin@shanghai.com",
    "password": "senha123"
  }'
```

---

## 2. Turism (rotas públicas)

### 2.1 Listar todos os pontos turísticos

```bash
curl -X GET https://api-senai-angular.vercel.app/api/turism
```

### 2.2 Listar com filtro por nome

```bash
curl -X GET "https://api-senai-angular.vercel.app/api/turism?name=temple"
```

### 2.3 Listar com filtro por categoria

```bash
curl -X GET "https://api-senai-angular.vercel.app/api/turism?category=historico"
```

### 2.4 Listar com filtro por ingresso

```bash
curl -X GET "https://api-senai-angular.vercel.app/api/turism?requires_ticket=true"
```

### 2.5 Listar com múltiplos filtros

```bash
curl -X GET "https://api-senai-angular.vercel.app/api/turism?name=temple&requires_ticket=false&category=historico"
```

### 2.6 Buscar ponto turístico por ID

```bash
curl -X GET https://api-senai-angular.vercel.app/api/turism/{{SPOT_ID}}
```

---

## 3. Admin — Turism CRUD (🔒 requer token)

### 3.1 Criar ponto turístico (com imagens)

```bash
curl -X POST https://api-senai-angular.vercel.app/api/admin/turism \
  -H "Authorization: Bearer {{TOKEN}}" \
  -F "name=Yu Garden" \
  -F "description=Jardim clássico chinês com mais de 400 anos de história" \
  -F "district=Huangpu" \
  -F "category=historico" \
  -F "latitude=31.2270" \
  -F "longitude=121.4920" \
  -F "requires_ticket=true" \
  -F "images=@/caminho/para/imagem1.jpg" \
  -F "images=@/caminho/para/imagem2.png"
```

> ⚠️ Substitua `/caminho/para/imagem1.jpg` pelo caminho real de uma imagem `.jpg` ou `.png` no seu computador.

### 3.2 Criar segundo ponto turístico (sem ingresso)

```bash
curl -X POST https://api-senai-angular.vercel.app/api/admin/turism \
  -H "Authorization: Bearer {{TOKEN}}" \
  -F "name=The Bund" \
  -F "description=Calçadão icônico à beira do rio Huangpu com vista para Pudong" \
  -F "district=Huangpu" \
  -F "category=paisagem" \
  -F "latitude=31.2400" \
  -F "longitude=121.4900" \
  -F "requires_ticket=false" \
  -F "images=@/caminho/para/imagem3.jpg"
```

### 3.3 Atualizar ponto turístico (sem trocar imagens)

```bash
curl -X PUT https://api-senai-angular.vercel.app/api/admin/turism/{{SPOT_ID}} \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Descrição atualizada do ponto turístico",
    "category": "cultural",
    "latitude": 31.2300,
    "longitude": 121.4950,
    "requires_ticket": false
  }'
```

### 3.4 Atualizar ponto turístico (trocando imagens)

```bash
curl -X PUT https://api-senai-angular.vercel.app/api/admin/turism/{{SPOT_ID}} \
  -H "Authorization: Bearer {{TOKEN}}" \
  -F "description=Nova descrição com novas imagens" \
  -F "category=moderno" \
  -F "requires_ticket=true" \
  -F "images=@/caminho/para/nova_imagem1.jpg" \
  -F "images=@/caminho/para/nova_imagem2.png"
```

> ⚠️ Ao enviar o campo `images`, todas as imagens anteriores serão deletadas do Vercel Blob e substituídas pelas novas.

### 3.5 Tentar alterar campo proibido (deve retornar 400)

```bash
curl -X PUT https://api-senai-angular.vercel.app/api/admin/turism/{{SPOT_ID}} \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Novo Nome Proibido"
  }'
```

> ❌ Esperado: `400 — Não é permitido alterar o campo "name"`

### 3.6 Deletar ponto turístico

```bash
curl -X DELETE https://api-senai-angular.vercel.app/api/admin/turism/{{SPOT_ID}} \
  -H "Authorization: Bearer {{TOKEN}}"
```

> ✅ Esperado: `204 No Content`

---

## 4. Testes de erro

### 4.1 Login com credenciais inválidas (401)

```bash
curl -X POST https://api-senai-angular.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@shanghai.com",
    "password": "senhaerrada"
  }'
```

### 4.2 Acessar rota admin sem token (401)

```bash
curl -X POST http://localhost:3000/api/admin/turism \
  -H "Content-Type: application/json" \
  -d '{"name": "Teste"}'
```

### 4.3 Buscar ponto turístico inexistente (404)

```bash
curl -X GET http://localhost:3000/api/turism/99999
```

### 4.4 Criar ponto com coordenadas fora do range (400)

```bash
curl -X POST http://localhost:3000/api/admin/turism \
  -H "Authorization: Bearer {{TOKEN}}" \
  -F "name=Fora do Mapa" \
  -F "description=Teste de coordenada inválida" \
  -F "district=Nowhere" \
  -F "category=teste" \
  -F "latitude=50.0000" \
  -F "longitude=121.0000" \
  -F "requires_ticket=false" \
  -F "images=@/caminho/para/imagem1.jpg"
```

> ❌ Esperado: `400 — Latitude deve estar entre 30.70 e 31.53`
