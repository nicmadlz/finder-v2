import { Injectable, NotFoundException } from "@nestjs/common";
import { AddressEntity } from "./address.entity";

@Injectable()
export class AddressRepository {
    private addresses: AddressEntity[] = [];
    private nextId = 1;
    constructor() { }

    async save(address: AddressEntity): Promise<AddressEntity> {
        address.id = this.nextId++;
        this.addresses.push(address);
        return address;
    }

    async list() {
        return this.addresses;
    }

    async haveAddress(street: string, number: number) {
        const possibleAddress = this.addresses.find(
            address => address.street == street && address.number == number
        );

        return possibleAddress !== undefined;
    }

    async searchId(id: number) {
        const possibleAddress = this.addresses.find(
            address => address.id === id
        );

        if (!possibleAddress) {
            throw new NotFoundException("Address do not exist!")
        }

        return possibleAddress;
    }

    async update(id: number, newData: Partial<AddressEntity>) {
        const address = this.searchId(id);

        Object.entries(newData).forEach(([key, value]) => {

            if (key === "id") {
                return;
            }

            address[key] = value;
        });

        return address;
    }

    async delete(id: number) {
        await this.searchId(id);

        this.addresses = this.addresses.filter(
            saveAddress => saveAddress.id !== id
        )

        return this.addresses;
    }
}