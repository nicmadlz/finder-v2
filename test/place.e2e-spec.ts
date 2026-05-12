import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { GlobalExceptionFilter } from '../src/filters/global-exception.filter';
import { DataSource } from 'typeorm';

interface LoginResponse {
  token: { accessToken: string };
}

interface PlaceResponse {
  createdPlace: { id: number; name: string };
}

describe('Place (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let id: number;
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
    await dataSource.query('DELETE FROM "places"');
    await dataSource.query('DELETE FROM "users"');
    await dataSource.query('DELETE FROM "address"');

    await request(server)
      .post('/auth/register')
      .send({ name: 'Nicolas', email: 'nicolas@test.com', password: '123456' });

    await dataSource.query(
      `UPDATE "users" SET "role" = 'admin' WHERE "email" = 'nicolas@test.com'`,
    );

    const loginResponse = await request(server)
      .post('/auth/login')
      .send({ email: 'nicolas@test.com', password: '123456' });

    token = (loginResponse.body as LoginResponse).token.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST - /places', async () => {
    const response = await request(server)
      .post('/places')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test',
        category: 'test',
        priceRange: 2,
        rating: 4,
        address: {
          street: 'test',
          number: 123,
          neighborhood: 'test',
          cep: 90440170,
        },
      });

    id = (response.body as PlaceResponse).createdPlace.id;

    expect(response.status).toBe(201);
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
    expect(response.body.createdPlace.name).toBe('Test');
  });

  it('GET - /places', async () => {
    const response = await request(server).get('/places?page=1&pageSize=10');

    expect(response.status).toBe(200);
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
    expect(response.body.data).toBeInstanceOf(Array);
  });

  it('GET - /places:id', async () => {
    const response = await request(server).get(`/places/${id}`);

    expect(response.status).toBe(200);
  });

  it('PUT - /places/:id', async () => {
    const response = await request(server)
      .put(`/places/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'nameUpdated' });

    expect(response.status).toBe(200);
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
    expect(response.body.place.name).toBe('nameUpdated');
  });

  it('Duplicated Name - POST /places', async () => {
    const response = await request(server)
      .post('/places')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'nameUpdated',
        category: 'test',
        priceRange: 2,
        rating: 4,
        address: {
          street: 'test',
          number: 123,
          neighborhood: 'test',
          cep: 90440170,
        },
      });

    expect(response.status).toBe(409);
  });

  it('Without Token - PUT /places/:id', async () => {
    const response = await request(server)
      .put(`/places/${id}`)
      .send({ name: 'nameUpdated2' });

    expect(response.status).toBe(401);
  });

  it('Invalid Id - PUT /places/:id', async () => {
    const response = await request(server)
      .put(`/places/-1`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'nameUpdated2' });

    expect(response.status).toBe(404);
  });

  it('Duplicated name - PUT /places/:id', async () => {
    const responsePost = await request(server)
      .post('/places')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test',
        category: 'test',
        priceRange: 2,
        rating: 4,
        address: {
          street: 'test',
          number: 123,
          neighborhood: 'test',
          cep: 90440170,
        },
      });

    const id2 = (responsePost.body as PlaceResponse).createdPlace.id;

    const response = await request(server)
      .put(`/places/${id2}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'nameUpdated' });

    expect(response.status).toBe(409);
  });

  it('Without Token - POST /places', async () => {
    const response = await request(server)
      .post('/places')
      .send({
        name: 'Test2',
        category: 'test',
        priceRange: 2,
        rating: 4,
        address: {
          street: 'test',
          number: 123,
          neighborhood: 'test',
          cep: 90440170,
        },
      });

    expect(response.status).toBe(401);
  });

  it('Invalid Id - GET /places:id', async () => {
    const response = await request(server).get(`/places/-1`);

    expect(response.status).toBe(404);
  });

  it('Without Token - DELETE /places/:id', async () => {
    const response = await request(server).delete(`/places/${id}`);

    expect(response.status).toBe(401);
  });

  it('DELETE - /places/:id (invalid)', async () => {
    const response = await request(server)
      .delete(`/places/-1`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it('DELETE - /places/:id', async () => {
    const response = await request(server)
      .delete(`/places/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
    expect(response.body.message).toBe('Place deleted!');
  });
});
