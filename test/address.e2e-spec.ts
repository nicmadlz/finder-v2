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
  createdPlace: {
    address: { id: number };
  };
}

describe('Address (e2e)', () => {
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

  it('PUT /addresses/:id', async () => {
    const placeResponse = await request(server)
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

    const { createdPlace } = placeResponse.body as PlaceResponse;

    const response = await request(server)
      .put(`/addresses/${createdPlace.address.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ street: 'test street' });

    id = createdPlace.address.id;

    expect(response.status).toBe(200);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(response.body.address.street).toBe('test street');
  });

  it('GET /addresses', async () => {
    const response = await request(server).get('/addresses');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject([
      {
        street: 'test street',
        number: 123,
        neighborhood: 'test',
        cep: 90440170,
      },
    ]);
  });

  it('GET /addresses/:id', async () => {
    const response = await request(server).get(`/addresses/${id}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: id,
      street: 'test street',
      number: 123,
      neighborhood: 'test',
      cep: 90440170,
    });
  });

  it('Wrong Id - GET /addresses/:id', async () => {
    const response = await request(server).get(`/addresses/-1`);

    expect(response.status).toBe(404);
  });

  it('Without token - PUT /addresses/:id', async () => {
    const placeResponse = await request(server)
      .post('/places')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'TestForPutERROR',
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

    const { createdPlace } = placeResponse.body as PlaceResponse;

    const response = await request(server)
      .put(`/addresses/${createdPlace.address.id}`)
      .send({ street: 'test street' });

    expect(response.status).toBe(401);
  });
});
