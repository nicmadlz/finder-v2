import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { GlobalExceptionFilter } from '../src/filters/global-exception.filter';
import { DataSource } from 'typeorm';

describe('Address (e2e)', () => {
    let app: INestApplication;
    let token: string;
    let id: number;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true
        }));
        app.useGlobalFilters(new GlobalExceptionFilter());
        await app.init();

        const dataSource = app.get(DataSource);
        await dataSource.query('DELETE FROM "places"');
        await dataSource.query('DELETE FROM "users"');
        await dataSource.query('DELETE FROM "address"');


        await request(app.getHttpServer())
            .post('/auth/register')
            .send({ name: 'Nicolas', email: 'nicolas@test.com', password: '123456' });

        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'nicolas@test.com', password: '123456' });

        token = loginResponse.body.token.accessToken;
    });

    afterAll(async () => {
        await app.close();
    });

    it('PUT /addresses/:id', async () => {
        const placeResponse = await request(app.getHttpServer())
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
                    cep: 90440170
                }
            });

        const addressId = placeResponse.body.createdPlace.address.id;

        const response = await request(app.getHttpServer())
            .put(`/addresses/${addressId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ street: 'test street' });
        
        id = placeResponse.body.createdPlace.address.id;
        
        expect(response.status).toBe(200);
        expect(response.body.address.street).toBe('test street');
    });

    it("GET /addresses", async () => {
        const response = await request(app.getHttpServer())
            .get("/addresses")

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject([{
            street: 'test street',
            number: 123,
            neighborhood: 'test',
            cep: 90440170
        }])
    });

    it("GET /addresses/:id", async () => {
        const response = await request(app.getHttpServer())
            .get(`/addresses/${id}`)

        console.log(response)

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            id: id,
            street: 'test street',
            number: 123,
            neighborhood: 'test',
            cep: 90440170
        })

    })
});