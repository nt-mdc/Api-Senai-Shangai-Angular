# Tourism Spots API

REST API built with **Node.js**, **Express**, **Prisma ORM**, and **PostgreSQL (Neon)**, optimized for deployment on **Vercel** as serverless functions.

---

## Tech Stack

| Technology      | Purpose                        |
|-----------------|--------------------------------|
| Express.js      | HTTP framework                 |
| Prisma          | ORM / database access          |
| PostgreSQL      | Database (via Neon serverless)  |
| JWT             | Stateless authentication       |
| Vercel Blob     | Image file storage             |
| bcrypt          | Password hashing               |
| Multer          | Multipart file upload (memory) |

---

## Getting Started

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

| Variable              | Source                                                                 |
|-----------------------|------------------------------------------------------------------------|
| `DATABASE_URL`        | [Neon](https://neon.tech) — Create a project, copy the connection URL  |
| `JWT_SECRET`          | Any secure random string (e.g., `openssl rand -hex 32`)               |
| `BLOB_READ_WRITE_TOKEN` | [Vercel Dashboard](https://vercel.com) → Project → Storage → Blob → Token |
| `PORT`                | Defaults to `3000` for local development                               |

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run database migrations

```bash
npx prisma migrate dev --name init
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

## Deploy to Vercel

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

## Test Credentials

| Field    | Value               |
|----------|---------------------|
| Email    | `admin@shanghai.com` |
| Password | `admin123`          |

---

## API Endpoints

### Auth (public)

| Method | Endpoint         | Description                |
|--------|------------------|----------------------------|
| POST   | `/api/auth/login` | Login and receive JWT token |

### Tourism (public)

| Method | Endpoint         | Description                                |
|--------|------------------|--------------------------------------------|
| GET    | `/api/turism`    | List spots (with optional filters)         |
| GET    | `/api/turism/:id`| Get a specific spot with images and author |

**Query filters for GET `/api/turism`:**
- `name` — partial match, case-insensitive
- `requires_ticket` — `true` or `false`
- `category` — exact match, case-insensitive

### Admin (requires Bearer token with admin role)

| Method | Endpoint              | Description                 |
|--------|-----------------------|-----------------------------|
| POST   | `/api/admin/admin`    | Create a new admin user     |
| POST   | `/api/admin/turism`   | Create a new tourism spot   |
| PUT    | `/api/admin/turism/:id` | Update a tourism spot     |
| DELETE | `/api/admin/turism/:id` | Delete a tourism spot     |

---

## Project Structure

```
/
├── api/
│   └── index.js              # Vercel entry point
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.js                # Seed script
├── src/
│   ├── config/
│   │   ├── database.js        # Prisma client singleton
│   │   └── multer.js          # Multer memory storage config
│   ├── controllers/
│   │   ├── authController.js
│   │   └── turismController.js
│   ├── middlewares/
│   │   ├── authGuard.js       # JWT verification
│   │   └── adminGuard.js      # Admin role check
│   ├── routes/
│   │   ├── index.js           # Route aggregator
│   │   ├── auth.js            # Public auth routes
│   │   ├── turism.js          # Public turism routes
│   │   └── admin.js           # Protected admin routes
│   ├── services/
│   │   ├── authService.js     # Auth business logic
│   │   └── turismService.js   # Turism CRUD + Blob logic
│   └── app.js                 # Express configuration
├── server.js                  # Local dev server
├── vercel.json                # Vercel deployment config
├── package.json
├── .env
└── .gitignore
```

---

## Error Response Format

All errors follow a consistent format:

```json
{
  "error": "Description of the error"
}
```

| Status | Meaning                          |
|--------|----------------------------------|
| 400    | Validation error                 |
| 401    | Unauthenticated                  |
| 403    | Unauthorized (not admin)         |
| 404    | Resource not found               |
| 500    | Unexpected server error          |
