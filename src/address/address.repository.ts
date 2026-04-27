import { Injectable } from "@nestjs/common";
import { AddressEntity } from "./address.entity";

@Injectable()
export class AddressRepository{
    private addresses: AddressEntity[] = [];
    private nextId = 1;
    constructor() {}

    async save(address: AddressEntity): Promise<AddressEntity>{
        address.id = this.nextId++;
        this.addresses.push(address);
        return address;
    }

    async list(){
        return this.addresses;
    }

    async haveAddress(street: string, number: number){
        const possibleAddress = this.addresses.find(
            address => address.street == street && address.number == number
        );

        return possibleAddress !== undefined;
    }

    async update(id: number, newData: Partial<AddressEntity>) {
        const possibleAddress = this.addresses.find(
            address => address.id === id
        );

        if (!possibleAddress) {
            throw new Error("Address do not exist!")
        }

        Object.entries(newData).forEach(([key, value]) => {

            if (key === "id") {
                return;
            }

            possibleAddress[key] = value;
        });

        return possibleAddress;
    }
}