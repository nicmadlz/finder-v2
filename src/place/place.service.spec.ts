import { Test, TestingModule } from "@nestjs/testing";
import { PlaceService } from "./place.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { PlaceEntity } from "./place.entity";
import { AddressEntity } from "src/address/address.entity";

describe("PlaceService", () => {
    let placeService: PlaceService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PlaceService,
                {
                    provide: getRepositoryToken(PlaceEntity),
                    useValue: {
                        findOne: jest.fn(),
                        save: jest.fn(),
                        find: jest.fn(),
                        remove: jest.fn(),
                    }
                }
            ],
        }).compile();

        placeService = module.get<PlaceService>(PlaceService);
    });

    it("must create a place", async () => {

        jest.spyOn(placeService["placeRepository"], "findOne")
            .mockResolvedValue(null);

        jest.spyOn(placeService["placeRepository"], "save")
            .mockResolvedValue({
                id: 1, name: "test", category: "test", priceRange: 12, rating: 5, address: {
                    id: 1, street: "Test", number: 111, neighborhood: "Centro", cep: 90440170
                } as AddressEntity
            } as PlaceEntity);

        await expect(
            placeService.createPlace({
                name: "test", category: "test", priceRange: 12, rating: 5, address: {
                    street: "Test", number: 111, neighborhood: "Centro", cep: 90440170
                }
            })
        ).resolves.toMatchObject({
            name: "test", category: "test", priceRange: 12, rating: 5, address: {
                street: "Test", number: 111, neighborhood: "Centro", cep: 90440170
            }
        })
    });

it("must return all places", async () => {
    jest.spyOn(placeService["placeRepository"], "find")
        .mockResolvedValue([{
            id: 1, name: "test", category: "test", priceRange: 12, rating: 5, address: {
                id: 1, street: "Test", number: 111, neighborhood: "Centro", cep: 90440170
            } as AddressEntity
        } as PlaceEntity]);

    await expect(placeService.listPlaces()).resolves.toMatchObject([{
        id: 1, name: "test", category: "test", priceRange: 12, rating: 5
    }])
});
});