# Finder

A REST API for discovering places in Porto Alegre — cafes, restaurants, bars, parties, and more — and organizing events at them.

---

## Overview

Finder exposes a place catalogue with authentication, role-based access control, and real-time updates. Authenticated users can also create events tied to those places, RSVP to other users' events, and receive email notifications when relevant changes happen. It integrates with an external places provider to enrich the local catalogue and uses a background queue to keep data in sync.

Full API reference is generated from the code and available through Swagger UI once the application is running (see [API Documentation](#api-documentation)).

---

## Features

- **Authentication & Authorization** — JWT-based login with role-based access control (`user` / `admin`). Registration emails the user a generated temporary password.
- **Password Reset** — users can change their password through a dedicated endpoint.
- **Places & Addresses** — full CRUD with paginated listing. Addresses are enriched via the [ViaCEP](https://viacep.com.br/) service from a Brazilian postal code (CEP).
- **Events & Attendance** — authenticated users can create events at a place, list events, RSVP (attend), unsubscribe, update, or delete their own events. The event creator and admins can update or delete an event; when an event is deleted, all subscribed attendees are notified by email. Time-overlap checks prevent a user from being booked into two simultaneous events.
- **Email Notifications** — transactional emails via `@nestjs-modules/mailer` (Nodemailer) for registration passwords and event deletions.
- **External Places Search** — proxy to an external provider for discovery beyond the local catalogue.
- **Caching** — Redis-backed response cache on read endpoints.
- **Background Jobs** — recurring synchronization with the external provider via BullMQ.
- **Real-time Updates** — WebSocket gateway (Socket.IO) emits `place-updated` events on writes.
- **Rate Limiting** — 10 requests per minute per client via `@nestjs/throttler`.
- **Validation** — request payloads validated with `class-validator` and a global `ValidationPipe`.
- **Centralized Error Handling** — global exception filter for consistent error responses.
- **API Documentation** — auto-generated OpenAPI (Swagger) docs.

---

## Tech Stack

| Layer            | Technology                              |
| ---------------- | --------------------------------------- |
| Framework        | NestJS 11 + TypeScript                  |
| Database         | PostgreSQL + TypeORM                    |
| Cache & Queues   | Redis + BullMQ                          |
| Authentication   | JWT (`@nestjs/jwt`, Passport) + bcrypt  |
| Real-time        | Socket.IO (`@nestjs/websockets`)        |
| Mail             | `@nestjs-modules/mailer` + Nodemailer   |
| External APIs    | ViaCEP (address lookup)                 |
| Validation       | class-validator, class-transformer      |
| Documentation    | Swagger (`@nestjs/swagger`)             |
| Testing          | Jest (unit) + Supertest (e2e)           |
| Infrastructure   | Docker, Docker Compose                  |

---

## Requirements

- Node.js `>= 18`
- npm
- Docker and Docker Compose

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/nicmadlz/finder-v2.git
cd finder-v2
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file at the project root:

```env
# Database
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=finder

# Test database (used by e2e tests and `npm run migration:run:test`)
DB_TEST_HOST=127.0.0.1
DB_TEST_PORT=5433
DB_TEST_NAME=finder_test

# pgAdmin (optional)
DB_ADMIN_EMAIL=admin@example.com

# JWT
JWT_SECRET=your_secret_key

# Redis
REDIS_HOST=localhost

# CORS (WebSocket)
CORS_ORIGIN=http://localhost:3000

# Admin seed — credentials used by `npm run seed` to create the initial admin user
ADMIN_EMAIL=admin@finder.com
ADMIN_PASSWORD=change_me

# SMTP — used to send transactional emails (e.g. Mailtrap sandbox)
SANDBOX_HOST=sandbox.smtp.mailtrap.io
SANDBOX_USERNAME=your_smtp_username
SANDBOX_PASSWORD=your_smtp_password
```

> The seed script creates the admin only if no admin user exists yet, so it is safe to re-run. Change `ADMIN_EMAIL` / `ADMIN_PASSWORD` before running it in any non-local environment.

### 4. Start the infrastructure

Spins up PostgreSQL, the test database, pgAdmin, and Redis:

```bash
docker-compose up -d
```

### 5. Run migrations

```bash
npm run migration:run
```

### 6. (Optional) Seed an admin user

Make sure `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set in your `.env`, then run:

```bash
npm run seed
```

This creates a user with the `admin` role using those credentials. The script is a no-op if an admin already exists.

### 7. Start the application

```bash
# development (watch mode)
npm run dev

# production
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`.

---

## API Documentation

After starting the application, the full interactive API reference is available at:

```
http://localhost:3000/api
```

It includes every endpoint, request/response schema, and an authentication flow you can use to try requests directly from the browser. Use the **Authorize** button with a Bearer token obtained from `POST /auth/login`.

---

## Authentication

Protected endpoints require a Bearer token in the `Authorization` header:

```http
Authorization: Bearer <token>
```

Tokens are obtained via `POST /auth/login`. Admin-only endpoints additionally require the authenticated user to hold the `admin` role.

---

## Events

Events are organized by authenticated users at an existing place.

| Method | Endpoint                  | Auth          | Description                                                                 |
| ------ | ------------------------- | ------------- | --------------------------------------------------------------------------- |
| POST   | `/events`                 | User          | Create an event at a place. The creator is automatically registered.        |
| GET    | `/events`                 | Public        | List all events (includes the place relation).                              |
| POST   | `/events/:id/attend`      | User          | RSVP to an event. Rejected if the event is full or overlaps another RSVP.   |
| DELETE | `/events/:id/attend`      | User          | Unsubscribe from an event you are attending (creators cannot unsubscribe).  |
| PATCH  | `/events/:id`             | Creator/Admin | Update an event. Only the creator or an admin can update.                   |
| DELETE | `/events/:id`             | Creator/Admin | Delete an event. All attendees are notified by email.                       |

---

## Database Migrations

```bash
# Generate a migration from entity changes
npm run migration:generate src/config/migrations/MigrationName

# Apply pending migrations
npm run migration:run

# Revert the last migration
npm run migration:revert

# Apply migrations against the test database
npm run migration:run:test
```

---

## Testing

```bash
# unit tests
npm test

# unit tests in watch mode
npm run test:watch

# coverage report
npm run test:cov

# end-to-end tests
npm run test:e2e
```

End-to-end tests run against the dedicated `postgres-test` container exposed on port `5433`.

---

## Project Structure

```
src/
├── address/             # Address module (entity, DTOs, controller, service, ViaCEP integration)
├── auth/                # Authentication, roles, guards, decorators, mail service
├── common/              # Shared interceptors and utilities
├── config/              # TypeORM data source, migrations, seeds
├── event/               # Event module (events, attendance, roles)
├── external-places/     # External provider integration
├── filters/             # Global exception filter
├── gateway/             # WebSocket gateway (real-time updates)
├── jobs/                # BullMQ processors (background sync)
├── place/               # Place module (entity, DTOs, controller, service)
├── app.module.ts
└── main.ts

test/                    # End-to-end tests
```

---

## Scripts Reference

| Script                       | Description                                    |
| ---------------------------- | ---------------------------------------------- |
| `npm run dev`                | Start the app in watch mode                    |
| `npm run start:prod`         | Start the compiled app                         |
| `npm run build`              | Compile TypeScript to `dist/`                  |
| `npm run lint`               | Lint and auto-fix sources                      |
| `npm run format`             | Format sources with Prettier                   |
| `npm test`                   | Run unit tests                                 |
| `npm run test:e2e`           | Run end-to-end tests                           |
| `npm run migration:generate` | Generate a new migration from entity changes  |
| `npm run migration:run`      | Apply pending migrations                       |
| `npm run migration:revert`   | Revert the last applied migration              |
| `npm run seed`               | Seed an initial admin user                     |

---

## License

MIT
