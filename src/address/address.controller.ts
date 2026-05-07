import { Body, Controller, Get, Inject, Param, Put, UseGuards, UseInterceptors } from "@nestjs/common";
import { AddressService } from "./address.service";
import { UpdateAddressDto } from "./dto/UpdateAddress.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CacheInterceptor, CacheKey, CacheTTL, Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Addresses")
@Controller("/addresses")
export class AddressController{

    constructor(
        private addressService: AddressService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    @ApiOperation({ summary: "List all addresses" })
    @ApiResponse({ status: 200, description: "Returns the list of addresses" })
    @UseInterceptors(CacheInterceptor)
    @CacheKey("address")
    @CacheTTL(60)
    @Get()
    async listAddresses() {
        return await this.addressService.listAddresses();
    }

    @ApiOperation({ summary: "Get an address by ID" })
    @ApiResponse({ status: 200, description: "Returns the address" })
    @ApiResponse({ status: 404, description: "Address not found" })
    @Get("/:id")
    async findAddress(@Param("id") id: number) {
        return await this.addressService.findAddress(id);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: "Update an address by ID" })
    @ApiResponse({ status: 200, description: "Returns the updated address and a success message" })
    @ApiResponse({ status: 400, description: "Invalid request body" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 404, description: "Address not found" })
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
