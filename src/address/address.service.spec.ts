import { Test, TestingModule } from "@nestjs/testing";
import { AddressService } from "./address.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { AddressEntity } from "./address.entity";
import { NotFoundException } from "@nestjs/common";

describe("AddressService", () => {
    let addressService: AddressService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AddressService,
                {
                    provide: getRepositoryToken(AddressEntity),
                    useValue: {
                        findOne: jest.fn(),
                        find: jest.fn(),
                        save: jest.fn()
                    }
                }
            ],
        }).compile();

        addressService = module.get<AddressService>(AddressService);
    });

    it("must return an address by id", async () => {
        jest.spyOn(addressService["addressRepository"], "findOne")
            .mockResolvedValue({
                id: 1, street: "Test", number: 111, neighborhood: "Centro", cep: 90440170
            } as AddressEntity);

        await expect(addressService.findAddress(1)).resolves.toMatchObject({
            id: 1, street: "Test", number: 111, neighborhood: "Centro", cep: 90440170
        });
    });

    it("must return all addresses", async () => {
        jest.spyOn(addressService["addressRepository"], "find")
            .mockResolvedValue([{ id: 1, street: "Test", number: 111, neighborhood: "Centro", cep: 90440170 } as AddressEntity])

        await expect(addressService.listAddresses()).resolves.toMatchObject([{ id: 1, street: "Test", number: 111, neighborhood: "Centro", cep: 90440170 }])
    });


    it("must update an address", async () => {
        jest.spyOn(addressService["addressRepository"], "findOne")
            .mockResolvedValue({ id: 1, street: "Test", number: 111, neighborhood: "Centro", cep: 90440170 } as AddressEntity);

        jest.spyOn(addressService["addressRepository"], "save")
            .mockResolvedValue({ id: 1, street: "Updated", number: 111, neighborhood: "Centro", cep: 90440170 } as AddressEntity);

        await expect(addressService.updateAddress(1, { street: "Updated" }))
            .resolves.toMatchObject({ id: 1, street: "Updated" });
    });

    it("must throw NotFoundException", async () => {
        jest.spyOn(addressService["addressRepository"], "findOne")
            .mockResolvedValue(null);

        await expect(addressService.findAddress(1)).rejects.toThrow(NotFoundException)
    });
});