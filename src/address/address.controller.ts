import { Body, Controller, Get, Inject, Param, Put, UseGuards, UseInterceptors } from "@nestjs/common";
import { AddressService } from "./address.service";
import { UpdateAddressDto } from "./dto/UpdateAddress.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CacheInterceptor, CacheKey, CacheTTL, Cache, CACHE_MANAGER } from "@nestjs/cache-manager";

@Controller("/addresses")
export class AddressController{

    constructor(
        private addressService: AddressService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    @UseInterceptors(CacheInterceptor)
    @CacheKey("address")
    @CacheTTL(60)
    @Get()
    async listAddresses() {
        return await this.addressService.listAddresses();
    }

    @Get("/:id")
    async findAddress(@Param("id") id: number) {
        return await this.addressService.findAddress(id);
    }

    @UseGuards(JwtAuthGuard)
    @Put("/:id")
    async updateAddress(@Param("id") id: number, @Body() newData: UpdateAddressDto) {
        const updatedAddress = await this.addressService.updateAddress(id, newData);
        await this.cacheManager.del("address")
        return {
            address: updatedAddress,
            message: "Address updated!"
        }
    }
}
