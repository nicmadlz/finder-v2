import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { UpdateAddressDto } from './dto/UpdateAddress.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  CacheInterceptor,
  CacheKey,
  CacheTTL,
  Cache,
  CACHE_MANAGER,
} from '@nestjs/cache-manager';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import {
  ApiListAddresses,
  ApiFindAddress,
  ApiUpdateAddress,
} from './decorators/address-api.decorator';

@ApiTags('Addresses')
@Controller('/addresses')
export class AddressController {
  constructor(
    private addressService: AddressService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @ApiListAddresses()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('address:list')
  @CacheTTL(60)
  @Get()
  async listAddresses() {
    return await this.addressService.listAddresses();
  }

  @ApiFindAddress()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60)
  @Get('/:id')
  async findAddress(@Param('id') id: number) {
    return await this.addressService.findAddress(id);
  }

  @ApiUpdateAddress()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put('/:id')
  async updateAddress(
    @Param('id') id: number,
    @Body() newData: UpdateAddressDto,
  ) {
    const updatedAddress = await this.addressService.updateAddress(id, newData);
    await this.cacheManager.del('address:list');
    await this.cacheManager.del(`/addresses/${id}`);
    return {
      address: updatedAddress,
      message: 'Address updated!',
    };
  }
}
