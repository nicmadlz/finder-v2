import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { GlobalExceptionFilter } from '../src/filters/global-exception.filter';
import { DataSource } from 'typeorm';

describe('Place (e2e)', () => {
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

    it("POST - /places", async () => {
        const response = await request(app.getHttpServer())
            .post("/places")
            .set("Authorization", `Bearer ${token}`)
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

        id = response.body.createdPlace.id;

        expect(response.status).toBe(201);
        expect(response.body.createdPlace.name).toBe("Test")
    })

    it("GET - /places", async () => {
        const response = await request(app.getHttpServer())
            .get("/places")

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array)
    })

    it("GET - /places:id", async () => {
        const response = await request(app.getHttpServer())
            .get(`/places/${id}`)

        expect(response.status).toBe(200);
    })

    it("PUT - /places/:id", async () => {
        const response = await request(app.getHttpServer())
            .put(`/places/${id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "nameUpdated" });

        expect(response.status).toBe(200);
        expect(response.body.place.name).toBe("nameUpdated")
    })

    it("Duplicated Name - POST /places", async () => {
        const response = await request(app.getHttpServer())
            .post("/places")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: 'nameUpdated',
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

        expect(response.status).toBe(409);
    })

    it("Without Token - PUT /places/:id", async () => {
        const response = await request(app.getHttpServer())
            .put(`/places/${id}`)
            .send({ name: "nameUpdated2" });

        expect(response.status).toBe(401);
    })

    it("Invalid Id - PUT /places/:id", async () => {
        const response = await request(app.getHttpServer())
            .put(`/places/-1`)
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "nameUpdated2" });

        expect(response.status).toBe(404);
    })

    it("Duplicated name - PUT /places/:id", async () => {
        const responsePost = await request(app.getHttpServer())
            .post("/places")
            .set("Authorization", `Bearer ${token}`)
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

        const id2 = responsePost.body.createdPlace.id;


        const response = await request(app.getHttpServer())
            .put(`/places/${id2}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "nameUpdated" });

        expect(response.status).toBe(409);
    })


    it("Without Token - POST /places", async () => {
        const response = await request(app.getHttpServer())
            .post("/places")
            .send({
                name: 'Test2',
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

        expect(response.status).toBe(401)
    })

    it("Invalid Id - GET /places:id", async () => {
        const response = await request(app.getHttpServer())
            .get(`/places/-1`)

        expect(response.status).toBe(404);
    })

    it("Without Token - DELETE /places/:id", async () => {
        const response = await request(app.getHttpServer())
            .delete(`/places/${id}`)

        expect(response.status).toBe(401);
    })

    it("DELETE - /places/:id", async () => {
        const response = await request(app.getHttpServer())
            .delete(`/places/-1`)
            .set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(404);
    })

    it("DELETE - /places/:id", async () => {
        const response = await request(app.getHttpServer())
            .delete(`/places/${id}`)
            .set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Place deleted!")
    })

})