import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { CreatePlaceDto } from "./dto/CreatePlace.dto";
import { UpdatePlaceDto } from "./dto/UpdatePlace.dto";
import { PlaceService } from "./place.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CACHE_MANAGER, CacheInterceptor, CacheKey, CacheTTL, Cache } from "@nestjs/cache-manager";

@Controller("/places")
export class PlaceController {

    constructor(
        private placeService: PlaceService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createPlace(@Body() placeData: CreatePlaceDto) {
        const createdPlace = await this.placeService.createPlace(placeData);
        await this.cacheManager.del("places")
        return {
            createdPlace: createdPlace,
            message: "Place created!"
        }
    }

    @UseInterceptors(CacheInterceptor)
    @CacheKey("places")
    @CacheTTL(60)
    @Get()
    async listPlaces(@Query("page") page: number, @Query("pageSize") pageSize: number) {
        return await this.placeService.listPlaces(+page, +pageSize);
    }

    @UseInterceptors(CacheInterceptor)
    @CacheKey("places")
    @CacheTTL(60)
    @Get("/:id")
    async findPlace(@Param("id") id: number) {
        return await this.placeService.findPlace(id);
    }

    
    @UseGuards(JwtAuthGuard)
    @Put("/:id")
    async updatePlace(@Param("id") id: number, @Body() newData: UpdatePlaceDto) {
        const updatedPlace = await this.placeService.updatePlace(id, newData);
        await this.cacheManager.del("places")
        return {
            place: updatedPlace,
            message: "Place updated!"
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete("/:id")
    async deletePlace(@Param("id") id: number) {
        const deletedPlace = await this.placeService.deletePlace(id);
        await this.cacheManager.del("places")
        return {
            place: deletedPlace,
            message: "Place deleted!"
        }
    }
}