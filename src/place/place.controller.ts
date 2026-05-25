import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreatePlaceDto } from './dto/CreatePlace.dto';
import { UpdatePlaceDto } from './dto/UpdatePlace.dto';
import { PlaceService } from './place.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  CACHE_MANAGER,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
  Cache,
} from '@nestjs/cache-manager';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import {
  ApiCreatePlace,
  ApiListPlaces,
  ApiFindPlace,
  ApiUpdatePlace,
  ApiDeletePlace,
} from './decorators/place-api.decorator';

@ApiTags('Places')
@Controller('/places')
export class PlaceController {
  constructor(
    private placeService: PlaceService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @ApiCreatePlace()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async createPlace(@Body() placeData: CreatePlaceDto) {
    const createdPlace = await this.placeService.createPlace(placeData);
    await this.cacheManager.del('places:list');
    await this.cacheManager.del('address:list');
    return { createdPlace, message: 'Place created!' };
  }

  @ApiListPlaces()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('places:list')
  @CacheTTL(60)
  @Get()
  async listPlaces(@Query('page') page = 1, @Query('pageSize') pageSize = 10) {
    return await this.placeService.listPlaces(+page, +pageSize);
  }

  @ApiFindPlace()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60)
  @Get('/:id')
  async findPlace(@Param('id') id: number) {
    return await this.placeService.findPlace(id);
  }

  @ApiUpdatePlace()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put('/:id')
  async updatePlace(@Param('id') id: number, @Body() newData: UpdatePlaceDto) {
    const updatedPlace = await this.placeService.updatePlace(id, newData);
    await this.cacheManager.del('places:list');
    await this.cacheManager.del('address:list');
    await this.cacheManager.del(`/places/${id}`);
    if (updatedPlace.address?.id) {
      await this.cacheManager.del(`/addresses/${updatedPlace.address.id}`);
    }
    return { place: updatedPlace, message: 'Place updated!' };
  }

  @ApiDeletePlace()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete('/:id')
  async deletePlace(@Param('id') id: number) {
    const deletedPlace = await this.placeService.deletePlace(id);
    await this.cacheManager.del('places:list');
    await this.cacheManager.del('address:list');
    await this.cacheManager.del(`/places/${id}`);
    if (deletedPlace.address?.id) {
      await this.cacheManager.del(`/addresses/${deletedPlace.address.id}`);
    }
    return { place: deletedPlace, message: 'Place deleted!' };
  }
}
