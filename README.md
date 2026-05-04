# Finder

A REST API for discovering places in Porto Alegre — cafes, restaurants, bars, parties, and more.

---

## About

Finder lets users explore and manage places across Porto Alegre. Built with NestJS, TypeScript, and PostgreSQL, with JWT authentication and database migrations via TypeORM.

---

## Stack

- NestJS
- TypeScript
- TypeORM
- PostgreSQL
- JWT
- bcrypt
- class-validator
- Docker

---

## Requirements

- Node.js >= 18
- npm
- Docker and Docker Compose

---

## Setup

**1. Clone the repository**

```bash
git clone https://github.com/nicmadlz/finder-v2.git
cd finder-v2
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Create a `.env` file at the root:

```env
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=finder
JWT_SECRET=your_secret_key
```

**4. Start the database**

```bash
docker-compose up -d
```

**5. Run migrations**

```bash
npm run migration:run
```

**6. Start the application**

```bash
# development
npm run dev

# production
npm run start:prod
```

---

## Migrations

```bash
# Generate a migration from entity changes
npm run migration:generate src/config/migrations/MigrationName

# Apply pending migrations
npm run migration:run

# Revert the last migration
npm run migration:revert
```

---

## Endpoints

### Auth

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Login and get JWT token | No |

### Places

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/places` | Create a place | Yes |
| GET | `/places` | List all places | No |
| GET | `/places/:id` | Get a place by ID | No |
| PUT | `/places/:id` | Update a place | Yes |
| DELETE | `/places/:id` | Delete a place | Yes |

### Addresses

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/addresses` | List all addresses | No |
| GET | `/addresses/:id` | Get an address by ID | No |
| PUT | `/addresses/:id` | Update an address | Yes |

---

## Authentication

Protected routes require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <token>
```

Get the token by calling `POST /auth/login`.

---

## Project Structure

```
src/
├── address/
│   ├── dto/
│   ├── address.controller.ts
│   ├── address.entity.ts
│   ├── address.module.ts
│   ├── address.repository.ts
│   └── address.service.ts
├── auth/
│   ├── dto/
│   ├── guards/
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   └── user.entity.ts
├── config/
│   ├── migrations/
│   ├── data-source.ts
│   └── postgres.config.service.ts
├── filters/
│   └── global-exception.filter.ts
├── place/
│   ├── dto/
│   ├── place.controller.ts
│   ├── place.entity.ts
│   ├── place.module.ts
│   └── place.service.ts
├── app.module.ts
└── main.ts
```

---

## License

MIT
