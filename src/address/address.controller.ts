import { Body, ConflictException, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { AddressRepository } from "./address.repository";
import { AddressEntity } from "./address.entity";
import { CreateAddressDTO } from "./dto/CreateAddress.dto";
import { UpdateAddress } from "./dto/UpdateAddress.dto";

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

    @Put("/:id")
    async updateAddress(@Param("id") id: number, @Body() newData: UpdateAddress) {

        const updatedAddress = await this.addressRepository.update(id, newData);

        return {
            address: updatedAddress,
            message: "Address updated!"
        }
    }
    
    @Delete("/:id")
    async deleteAddress(@Param("id") id: number){
        const deletedAddress = await this.addressRepository.delete(id);

        return {
            address: deletedAddress,
            message: "Address deleted!"
        }
    }
}