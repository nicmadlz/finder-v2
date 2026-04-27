import { Injectable } from "@nestjs/common";

@Injectable()
export class AddressRepository{
    private addresses: any[] = [];

    async save(address){
        this.addresses.push(address);
        console.log(this.addresses);
    }

    async list(){
        return this.addresses;
    }

    async haveAddress(street, number){
        const possibleAddress = this.addresses.find(
            address => address.street == street && address.number == number
        );

        return possibleAddress !== undefined;
    }
}