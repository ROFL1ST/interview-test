# Authentication REST API

REST API authentication service built with Express.js, PostgreSQL, and Knex.js.

## Tech Stack

- **Node.js** & **Express.js** (JavaScript)
- **PostgreSQL**
- **Knex.js** (query builder & migrations)
- **JWT** (`jsonwebtoken`) & **bcryptjs**
- **Joi** (request validation)
- **Swagger UI** (API documentation)
- **Jest** & **Supertest** (automated testing)

## Project Structure

```text
├── Dockerfile
├── docker-compose.yml
├── knexfile.js
├── package.json
├── postman_collection.json
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── env.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── userController.js
│   ├── database/
│   │   ├── migrations/
│   │   └── seeds/
│   ├── docs/
│   │   ├── openapi.yaml
│   │   └── swagger.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── validationMiddleware.js
│   ├── repositories/
│   │   └── userRepository.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── index.js
│   ├── services/
│   │   ├── authService.js
│   │   └── userService.js
│   ├── utils/
│   │   ├── apiResponse.js
│   │   ├── jwt.js
│   │   └── password.js
│   ├── validations/
│   │   └── authValidation.js
│   ├── app.js
│   └── server.js
└── tests/
    ├── api.test.js
    └── utils.test.js
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Default configuration:

```ini
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=widya_auth_db

JWT_SECRET=super_secret_jwt_key_widya_robotics_2026
JWT_EXPIRES_IN=24h
```

### 3. Database Setup

Using Docker Compose:

```bash
docker-compose up -d
```

Or make sure a local PostgreSQL instance is running with database `widya_auth_db`.

Run migrations:

```bash
npm run migrate
```

(Optional) Run seeds:

```bash
npm run seed
```

> Seeded accounts:
> - `user@widya.ai` / `password123`
> - `engineer@widya.ai` / `password123`

### 4. Run Server

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

Server runs at `http://localhost:3000`.

## API Documentation

- **Swagger UI**: `http://localhost:3000/api-docs`
- **Postman**: Import `postman_collection.json` located at the root of the project.

### Endpoints

| Method | Endpoint | Auth | Description |
|:---|:---|:---|:---|
| `GET` | `/api/v1/health` | No | Health check |
| `POST` | `/api/v1/auth/register` | No | Register new user |
| `POST` | `/api/v1/auth/login` | No | Login and get JWT token |
| `GET` | `/api/v1/users/profile` | Bearer JWT | Get authenticated user profile |
| `GET` | `/api/v1/profile` | Bearer JWT | Alias for user profile |

#### Register (`POST /api/v1/auth/register`)

Request:
```json
{
  "name": "Budi Santoso",
  "email": "budi.santoso@widya.ai",
  "password": "password123",
  "gender": "laki-laki"
}
```

Response (201):
```json
{
  "success": true,
  "message": "Registrasi berhasil. Akun Anda telah dibuat",
  "data": {
    "id": 1,
    "name": "Budi Santoso",
    "email": "budi.santoso@widya.ai",
    "gender": "laki-laki",
    "created_at": "2026-11-01T12:00:00.000Z",
    "updated_at": "2026-11-01T12:00:00.000Z"
  }
}
```

#### Login (`POST /api/v1/auth/login`)

Request:
```json
{
  "email": "budi.santoso@widya.ai",
  "password": "password123"
}
```

Response (200):
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "<jwt-token>",
    "user": {
      "id": 1,
      "name": "Budi Santoso",
      "email": "budi.santoso@widya.ai",
      "gender": "laki-laki"
    }
  }
}
```

#### Profile (`GET /api/v1/users/profile`)

Header: `Authorization: Bearer <jwt-token>`

Response (200):
```json
{
  "success": true,
  "message": "Data profile user berhasil diambil",
  "data": {
    "id": 1,
    "name": "Budi Santoso",
    "email": "budi.santoso@widya.ai",
    "gender": "laki-laki",
    "created_at": "2026-11-01T12:00:00.000Z",
    "updated_at": "2026-11-01T12:00:00.000Z"
  }
}
```

## Testing

Run unit and integration tests:

```bash
npm test
```
