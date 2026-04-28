import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { AddressService } from "./address.service";
import { CreateAddressDto } from "./dto/CreateAddress.dto";
import { UpdateAddressDto } from "./dto/UpdateAddress.dto";

@Controller("/addresses")
export class AddressController{

    constructor(
        private addressService: AddressService
    ) { }

    @Post()
    async createAddress(@Body() addressData: CreateAddressDto) {
        const createdAddress = await this.addressService.createAddress(addressData);
        return {
            createdAddress: createdAddress,
            message: "Address created!"
        }
    }

    @Get()
    async listAddresses() {
        return await this.addressService.listAddresses();
    }

    @Put("/:id")
    async updateAddresses(@Param("id") id: number, @Body() newData: UpdateAddressDto) {
        const updatedAddress = await this.addressService.updateAddress(id, newData);
        return {
            address: updatedAddress,
            message: "Address updated!"
        }
    }

    @Delete("/:id")
    async deleteAddress(@Param("id") id: number) {
        const deletedAddress = await this.addressService.deleteAddress(id);
        return {
            deletedAddress: deletedAddress,
            message: "Address deleted!"
        }
    }
}