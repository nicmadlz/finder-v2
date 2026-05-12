import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { GlobalExceptionFilter } from '../src/filters/global-exception.filter';
import { DataSource } from 'typeorm';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let server: Parameters<typeof request>[0];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.useGlobalFilters(new GlobalExceptionFilter());
    await app.init();

    server = app.getHttpServer() as Parameters<typeof request>[0];

    const dataSource = app.get(DataSource);
    await dataSource.query('DELETE FROM "users"');
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/register', async () => {
    const response = await request(server)
      .post('/auth/register')
      .send({ name: 'Nicolas', email: 'nicolas@test.com', password: '123456' });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      user: {
        name: 'Nicolas',
      },
      message: 'User created!',
    });
  });

  it('POST /auth/login', async () => {
    const response = await request(server)
      .post('/auth/login')
      .send({ email: 'nicolas@test.com', password: '123456' });

    expect(response.status).toBe(201);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(response.body.token.accessToken).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(typeof response.body.token.accessToken).toBe('string');
  });

  it('Same Email - POST /auth/register', async () => {
    const response = await request(server)
      .post('/auth/register')
      .send({ name: 'Nicolas', email: 'nicolas@test.com', password: '123456' });

    expect(response.status).toBe(409);
  });

  it('Wrong Email - POST /auth/login', async () => {
    const response = await request(server)
      .post('/auth/login')
      .send({ email: 'wrongEmail@test.com', password: '123456' });

    expect(response.status).toBe(401);
  });

  it('Wrong Password - POST /auth/login', async () => {
    const response = await request(server)
      .post('/auth/login')
      .send({ email: 'nicolas@test.com', password: 'wrongPassword' });

    expect(response.status).toBe(401);
  });
});
