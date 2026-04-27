import { Body, ConflictException, Controller, Get, Post } from "@nestjs/common";
import { AddressRepository } from "./address.repository";
import { AddressEntity } from "./address.entity";
import { CreateAddressDTO } from "./dto/CreateAddress.dto";

@Controller("/addresses")
export class AddressController{

    constructor(private addressRepository: AddressRepository) {}

    @Post()
    async createAddress(@Body() addressData: CreateAddressDTO){
        const exist = await this.addressRepository.haveAddress(addressData.street, addressData.number);
        if(!exist){
            const address = Object.assign(new AddressEntity(), addressData);
            const saved = await this.addressRepository.save(address);
            return {
                Address: saved,
                message: "Address created!"
            };
        }
        throw new ConflictException("This address has already been created!")
    }

    @Get()
    async listAddresses(){
        return this.addressRepository.list();
    }
}