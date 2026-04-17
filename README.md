# 🌐 API Angular — Multi-Project Backend

REST API built with **Node.js**, **Express**, **Prisma ORM**, and **PostgreSQL (Neon)**, optimized for deployment on **Vercel** as serverless functions.

This API serves as the backend for **7 independent projects**, each designed as a standalone Angular exercise. All projects share the same authentication system and database infrastructure.

---

## 📋 Projects & Route Prefixes

| Prefixo | Projeto | Descrição |
|---|---|---|
| `/api/auth` | **Auth** | Login e autenticação JWT |
| `/api/turism` | **Shanghai Expedition** | Pontos Turísticos de Xangai |
| `/api/pets` | **Amigo Fiel** | Portal de Adoção de Pets |
| `/api/courses` | **EduTech** | Catálogo de Cursos Online |
| `/api/properties` | **EasyHome** | Sistema de Imobiliária |
| `/api/dishes` | **Chef's Menu** | Cardápio Digital Interno |
| `/api/plans` | **Fitness Hub** | Planos de Assinatura (Academia) |
| `/api/modalities` | **Fitness Hub** | Modalidades de Treino |
| `/api/events` | **Event-IT** | Plataforma de Eventos |
| `/api/admin/*` | **Admin** | Rotas protegidas (CRUD) de todos os projetos |

---

## ⚙️ Tech Stack

| Technology | Purpose |
|---|---|
| Express.js | HTTP framework |
| Prisma | ORM / database access |
| PostgreSQL | Database (via Neon serverless) |
| JWT | Stateless authentication |
| Vercel Blob | Image file storage |
| bcrypt | Password hashing |
| Multer | Multipart file upload (memory) |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repo-url>
cd api-angular
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
JWT_SECRET="your_jwt_secret"
BLOB_READ_WRITE_TOKEN="your_vercel_blob_token"
PORT=3000
```

#### Where to get each variable:

| Variable | Source |
|---|---|
| `DATABASE_URL` | [Neon](https://neon.tech) — Create a project, copy the connection URL |
| `JWT_SECRET` | Any secure random string (e.g., `openssl rand -hex 32`) |
| `BLOB_READ_WRITE_TOKEN` | [Vercel Dashboard](https://vercel.com) → Project → Storage → Blob → Token |
| `PORT` | Defaults to `3000` for local development |

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run database migrations

```bash
npx prisma db push
```

### 6. Seed the database

```bash
npx prisma db seed
```

### 7. Run locally

```bash
npm run dev
```

The API will be available at `http://localhost:3000`.

---

## ☁️ Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Import project on Vercel

- Go to [vercel.com](https://vercel.com)
- Click **"New Project"** → Import your GitHub repo
- Add the environment variables (`DATABASE_URL`, `JWT_SECRET`, `BLOB_READ_WRITE_TOKEN`)
- Deploy!

### 3. Run migrations on production

```bash
npx prisma migrate deploy
npx prisma db seed
```

---

## 🔑 Test Credentials

| Field | Value |
|---|---|
| Email | `admin@shanghai.com` |
| Password | `admin123` |

---

## 📡 API Endpoints

### 🔓 Auth (público)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Login — retorna JWT token |

**Body:**
```json
{
  "email": "admin@shanghai.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### 🗺️ Shanghai Expedition — `/api/turism` (público)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/turism` | Listar pontos turísticos |
| `GET` | `/api/turism/:id` | Buscar ponto por ID |

**Query filters para `GET /api/turism`:**

| Param | Tipo | Descrição |
|---|---|---|
| `name` | string | Busca parcial, case-insensitive |
| `requires_ticket` | boolean | `true` ou `false` |
| `category` | string | Match exato, case-insensitive |

---

### 🐾 Amigo Fiel — `/api/pets` (público)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/pets` | Listar todos os pets |
| `GET` | `/api/pets/:id` | Buscar pet por ID |

**Query filters para `GET /api/pets`:**

| Param | Tipo | Descrição |
|---|---|---|
| `name` | string | Busca parcial, case-insensitive |
| `species` | string | Espécie exata (Cachorro, Gato, Ave, Roedor, Outro) |
| `size` | string | Porte exato (Pequeno, Médio, Grande) |

---

### 📚 EduTech — `/api/courses` (público)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/courses` | Listar todos os cursos |
| `GET` | `/api/courses/:id` | Buscar curso por ID |

**Query filters para `GET /api/courses`:**

| Param | Tipo | Descrição |
|---|---|---|
| `title` | string | Busca parcial, case-insensitive |
| `instructor` | string | Busca parcial, case-insensitive |
| `category` | string | Categoria exata (Programação, Design, Marketing, Negócios, Outro) |

---

### 🏠 EasyHome — `/api/properties` (público)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/properties` | Listar todos os imóveis |
| `GET` | `/api/properties/:id` | Buscar imóvel por ID |

**Query filters para `GET /api/properties`:**

| Param | Tipo | Descrição |
|---|---|---|
| `address` | string | Busca parcial, case-insensitive |
| `type` | string | Tipo exato (Casa, Apartamento, Terreno) |
| `modality` | string | Modalidade exata (Venda, Aluguel) |

---

### 🍽️ Chef's Menu — `/api/dishes` (público)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dishes` | Listar todos os pratos |
| `GET` | `/api/dishes/:id` | Buscar prato por ID |

**Query filters para `GET /api/dishes`:**

| Param | Tipo | Descrição |
|---|---|---|
| `name` | string | Busca parcial, case-insensitive |
| `category` | string | Categoria exata (Entrada, Prato Principal, Sobremesa, Bebida) |

---

### 💪 Fitness Hub — `/api/plans` (público)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/plans` | Listar todos os planos |
| `GET` | `/api/plans/:id` | Buscar plano por ID |

**Query filters para `GET /api/plans`:**

| Param | Tipo | Descrição |
|---|---|---|
| `name` | string | Busca parcial, case-insensitive |
| `type` | string | Tipo exato (Mensal, Semestral, Anual, VIP) |
| `priceMin` | number | Preço mínimo (faixa de preço) |
| `priceMax` | number | Preço máximo (faixa de preço) |

---

### 💪 Fitness Hub — `/api/modalities` (público)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/modalities` | Listar todas as modalidades |
| `GET` | `/api/modalities/:id` | Buscar modalidade por ID |

**Query filters para `GET /api/modalities`:**

| Param | Tipo | Descrição |
|---|---|---|
| `name` | string | Busca parcial, case-insensitive |
| `level` | string | Nível exato (Iniciante, Intermediário, Avançado, Todos os Níveis) |
| `status` | string | Status exato (Ativa, Inativa) |

---

### 🎫 Event-IT — `/api/events` (público)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/events` | Listar todos os eventos |
| `GET` | `/api/events/:id` | Buscar evento por ID |

**Query filters para `GET /api/events`:**

| Param | Tipo | Descrição |
|---|---|---|
| `name` | string | Busca parcial, case-insensitive |
| `category` | string | Categoria exata (Workshop, Palestra, Conferência) |
| `date` | string | Data específica (YYYY-MM-DD) |

---

### 🔐 Admin Routes (requer `Authorization: Bearer <token>`)

> **Todas as rotas abaixo exigem autenticação JWT com role `admin`.**

#### Gerenciamento de Usuários

| Method | Endpoint | Body | Description |
|---|---|---|---|
| `POST` | `/api/admin/admin` | `{ name, email, password }` | Criar novo admin |

#### Shanghai — CRUD de Pontos Turísticos

| Method | Endpoint | Body | Description |
|---|---|---|---|
| `POST` | `/api/admin/turism` | `multipart/form-data` | Criar ponto turístico (com imagens) |
| `PUT` | `/api/admin/turism/:id` | `multipart/form-data` | Editar ponto turístico |
| `DELETE` | `/api/admin/turism/:id` | — | Excluir ponto turístico |

#### Amigo Fiel — CRUD de Pets

| Method | Endpoint | Body (JSON) | Description |
|---|---|---|---|
| `POST` | `/api/admin/pets` | `{ name, species, age, size, description?, status? }` | Cadastrar pet |
| `PUT` | `/api/admin/pets/:id` | `{ name?, species?, age?, size?, description?, status? }` | Editar pet |
| `DELETE` | `/api/admin/pets/:id` | — | Excluir pet |

**Validações:**

| Campo | Regra |
|---|---|
| `name` | Obrigatório, mínimo 3 caracteres |
| `species` | Obrigatório |
| `age` | Obrigatório, ≥ 0 |
| `size` | Obrigatório |
| `status` | `disponivel` (default) ou `adotado` |

#### EduTech — CRUD de Cursos

| Method | Endpoint | Body (JSON) | Description |
|---|---|---|---|
| `POST` | `/api/admin/courses` | `{ title, instructor, category, workload, price, description? }` | Cadastrar curso |
| `PUT` | `/api/admin/courses/:id` | `{ title?, instructor?, category?, workload?, price?, description? }` | Editar curso |
| `DELETE` | `/api/admin/courses/:id` | — | Excluir curso |

**Validações:**

| Campo | Regra |
|---|---|
| `title` | Obrigatório |
| `instructor` | Obrigatório |
| `category` | Obrigatório |
| `workload` | Obrigatório, ≥ 1 |
| `price` | Obrigatório, ≥ 0 |

#### EasyHome — CRUD de Imóveis

| Method | Endpoint | Body (JSON) | Description |
|---|---|---|---|
| `POST` | `/api/admin/properties` | `{ type, address, area, price, modality, description?, status? }` | Cadastrar imóvel |
| `PUT` | `/api/admin/properties/:id` | `{ type?, address?, area?, price?, modality?, description?, status? }` | Editar imóvel |
| `DELETE` | `/api/admin/properties/:id` | — | Excluir imóvel |

**Validações:**

| Campo | Regra |
|---|---|
| `type` | Obrigatório (Casa, Apartamento, Terreno) |
| `address` | Obrigatório |
| `area` | Obrigatório, ≥ 1 |
| `price` | Obrigatório, ≥ 0 |
| `modality` | Obrigatório (Venda, Aluguel) |
| `status` | `disponivel` (default), `vendido`, `alugado` |

#### Chef's Menu — CRUD de Pratos

| Method | Endpoint | Body (JSON) | Description |
|---|---|---|---|
| `POST` | `/api/admin/dishes` | `{ name, category, price, description?, available? }` | Cadastrar prato |
| `PUT` | `/api/admin/dishes/:id` | `{ name?, category?, price?, description?, available? }` | Editar prato |
| `PATCH` | `/api/admin/dishes/:id/toggle` | — | Alternar disponibilidade |
| `DELETE` | `/api/admin/dishes/:id` | — | Excluir prato |

**Validações:**

| Campo | Regra |
|---|---|
| `name` | Obrigatório |
| `category` | Obrigatório (Entrada, Prato Principal, Sobremesa, Bebida) |
| `price` | Obrigatório, ≥ 0.01 |
| `available` | Booleano, default `true` |

#### Fitness Hub — CRUD de Planos

| Method | Endpoint | Body (JSON) | Description |
|---|---|---|---|
| `POST` | `/api/admin/plans` | `{ name, type, price, weekly_frequency, description }` | Cadastrar plano |
| `PUT` | `/api/admin/plans/:id` | `{ name?, type?, price?, weekly_frequency?, description? }` | Editar plano |
| `DELETE` | `/api/admin/plans/:id` | — | Excluir plano |

**Validações:**

| Campo | Regra |
|---|---|
| `name` | Obrigatório |
| `type` | Obrigatório (Mensal, Semestral, Anual, VIP) |
| `price` | Obrigatório, ≥ 0.01 |
| `weekly_frequency` | Obrigatório, entre 1 e 7 |
| `description` | Obrigatório, mínimo 20 caracteres |

#### Fitness Hub — CRUD de Modalidades

| Method | Endpoint | Body (JSON) | Description |
|---|---|---|---|
| `POST` | `/api/admin/modalities` | `{ name, description, level, status? }` | Cadastrar modalidade |
| `PUT` | `/api/admin/modalities/:id` | `{ name?, description?, level?, status? }` | Editar modalidade |
| `DELETE` | `/api/admin/modalities/:id` | — | Excluir modalidade |

**Validações:**

| Campo | Regra |
|---|---|
| `name` | Obrigatório |
| `description` | Obrigatório, mínimo 20 caracteres |
| `level` | Obrigatório (Iniciante, Intermediário, Avançado, Todos os Níveis) |
| `status` | `ativa` (default) ou `inativa` |

#### Event-IT — CRUD de Eventos

| Method | Endpoint | Body (JSON) | Description |
|---|---|---|---|
| `POST` | `/api/admin/events` | `{ name, category, date_time, location, max_capacity, description? }` | Cadastrar evento |
| `PUT` | `/api/admin/events/:id` | `{ name?, category?, date_time?, location?, max_capacity?, description? }` | Editar evento |
| `DELETE` | `/api/admin/events/:id` | — | Excluir evento |

**Validações:**

| Campo | Regra |
|---|---|
| `name` | Obrigatório |
| `category` | Obrigatório (Workshop, Palestra, Conferência) |
| `date_time` | Obrigatório, não permite datas retroativas |
| `location` | Obrigatório |
| `max_capacity` | Obrigatório, ≥ 1 |
| `description` | Opcional |

---

## 📂 Project Structure

```
/
├── api/
│   └── index.js                    # Vercel entry point
├── prisma/
│   ├── schema.prisma                # Database schema (User, TurismSpot, Pet, Course, Property, Dish, Plan, Modality, Event)
│   ├── seed.js                      # Seed script (admin users)
│   └── migrations/                  # SQL migrations
├── src/
│   ├── config/
│   │   ├── database.js              # Prisma client singleton
│   │   └── multer.js                # Multer memory storage config
│   ├── controllers/
│   │   ├── authController.js        # Login + create admin
│   │   ├── turismController.js      # Shanghai CRUD
│   │   ├── petController.js         # Amigo Fiel CRUD
│   │   ├── courseController.js      # EduTech CRUD
│   │   ├── propertyController.js    # EasyHome CRUD
│   │   ├── dishController.js        # Chef's Menu CRUD
│   │   ├── planController.js        # Fitness Hub Plans CRUD
│   │   ├── modalityController.js    # Fitness Hub Modalities CRUD
│   │   └── eventController.js       # Event-IT CRUD
│   ├── middlewares/
│   │   ├── authGuard.js             # JWT verification
│   │   └── adminGuard.js            # Admin role check
│   ├── routes/
│   │   ├── index.js                 # Route aggregator
│   │   ├── auth.js                  # POST /api/auth/login
│   │   ├── turism.js                # GET /api/turism
│   │   ├── pets.js                  # GET /api/pets
│   │   ├── courses.js               # GET /api/courses
│   │   ├── properties.js            # GET /api/properties
│   │   ├── dishes.js                # GET /api/dishes
│   │   ├── plans.js                 # GET /api/plans
│   │   ├── modalities.js            # GET /api/modalities
│   │   ├── events.js                # GET /api/events
│   │   └── admin.js                 # All protected CRUD routes
│   ├── services/
│   │   ├── authService.js           # Auth logic (JWT, bcrypt)
│   │   ├── turismService.js         # Turism CRUD + Blob upload
│   │   ├── petService.js            # Pet business logic
│   │   ├── courseService.js         # Course business logic
│   │   ├── propertyService.js       # Property business logic
│   │   ├── dishService.js           # Dish business logic + toggle
│   │   ├── planService.js           # Plan business logic
│   │   ├── modalityService.js       # Modality business logic
│   │   └── eventService.js          # Event business logic
│   └── app.js                       # Express configuration
├── docs/                            # API documentation pages
│   ├── amigo-fiel.html
│   ├── edutech.html
│   ├── easyhome.html
│   └── chefs-menu.html
├── server.js                        # Local dev server
├── vercel.json                      # Vercel deployment config
├── package.json
├── .env
└── .gitignore
```

---

## 🏗️ Database Schema

```
User (shared)
├── Pet          (Amigo Fiel)
├── Course       (EduTech)
├── Property     (EasyHome)
├── Dish         (Chef's Menu)
├── Plan         (Fitness Hub)
├── Modality     (Fitness Hub)
├── Event        (Event-IT)
├── TurismSpot   (Shanghai)
│   └── TurismImage
```

Todos os models possuem relação com `User` via campo `created_by`.

---

## ❌ Error Response Format

All errors follow a consistent format:

```json
{
  "error": "Description of the error"
}
```

| Status | Meaning |
|---|---|
| 400 | Validation error |
| 401 | Unauthenticated |
| 403 | Unauthorized (not admin) |
| 404 | Resource not found |
| 500 | Unexpected server error |
