import { Body, Controller, Get, Param, Put } from "@nestjs/common";
import { AddressService } from "./address.service";
import { UpdateAddressDto } from "./dto/UpdateAddress.dto";

@Controller("/addresses")
export class AddressController{

    constructor(
        private addressService: AddressService
    ) { }

    @Get()
    async listAddresses() {
        return await this.addressService.listAddresses();
    }

    @Get("/:id")
    async findAddress(@Param("id") id: number) {
        return await this.addressService.findAddress(id);
    }

    @Put("/:id")
    async updateAddress(@Param("id") id: number, @Body() newData: UpdateAddressDto) {
        const updatedAddress = await this.addressService.updateAddress(id, newData);
        return {
            address: updatedAddress,
            message: "Address updated!"
        }
    }
}
