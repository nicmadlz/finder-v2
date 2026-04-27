import { Injectable } from "@nestjs/common";
import { AddressEntity } from "./address.entity";

@Injectable()
export class AddressRepository{
    private addresses: AddressEntity[] = [];
    constructor(private nextId = 1) {}

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
}