import { Body, ConflictException, Controller, Get, Post } from "@nestjs/common";
import { AddressRepository } from "./address.repository";
import { CreateAddressDTO } from "./dto/CreateAddress.dto";

@Controller("/addresses")
export class AddressController{

    constructor(private addressRepository: AddressRepository) {}

    @Post()
    async createAddress(@Body() addressData: CreateAddressDTO){
        const exist = await this.addressRepository.haveAddress(addressData.street, addressData.number);
        if(!exist){
            this.addressRepository.save(addressData);
            return addressData;
        }
        throw new ConflictException("This address has already been created!")
    }

    @Get()
    async listAddresses(){
        return this.addressRepository.list();
    }
}