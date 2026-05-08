import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { CreatePlaceDto } from "./dto/CreatePlace.dto";
import { UpdatePlaceDto } from "./dto/UpdatePlace.dto";
import { PlaceService } from "./place.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CACHE_MANAGER, CacheInterceptor, CacheKey, CacheTTL, Cache } from "@nestjs/cache-manager";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "src/auth/enums/role.enum";
import { RolesGuard } from "src/auth/guards/roles.guard";

@ApiTags("Places")
@Controller("/places")
export class PlaceController {

    constructor(
        private placeService: PlaceService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    @ApiBearerAuth()
    @ApiOperation({ summary: "Create a place" })
    @ApiResponse({ status: 201, description: "Returns the created place and a success message" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post()
    async createPlace(@Body() placeData: CreatePlaceDto) {
        const createdPlace = await this.placeService.createPlace(placeData);
        await this.cacheManager.del("places:list");
        return { createdPlace, message: "Place created!" };
    }

    @ApiOperation({ summary: "List all places with pagination" })
    @ApiResponse({ status: 200, description: "Returns paginated list of places" })
    @UseInterceptors(CacheInterceptor)
    @CacheKey("places:list")
    @CacheTTL(60)
    @Get()
    async listPlaces(@Query("page") page: number, @Query("pageSize") pageSize: number) {
        return await this.placeService.listPlaces(+page, +pageSize);
    }

    @ApiOperation({ summary: "Get a place by ID" })
    @ApiResponse({ status: 200, description: "Returns the place" })
    @ApiResponse({ status: 404, description: "Place not found" })
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(60)
    @Get("/:id")
    async findPlace(@Param("id") id: number) {
        return await this.placeService.findPlace(id);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: "Update a place by ID" })
    @ApiResponse({ status: 200, description: "Returns the updated place and a success message" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 404, description: "Place not found" })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Put("/:id")
    async updatePlace(@Param("id") id: number, @Body() newData: UpdatePlaceDto) {
        const updatedPlace = await this.placeService.updatePlace(id, newData);
        await this.cacheManager.del("places:list");
        return { place: updatedPlace, message: "Place updated!" };
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: "Delete a place by ID" })
    @ApiResponse({ status: 200, description: "Returns the deleted place and a success message" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 404, description: "Place not found" })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete("/:id")
    async deletePlace(@Param("id") id: number) {
        const deletedPlace = await this.placeService.deletePlace(id);
        await this.cacheManager.del("places:list");
        return { place: deletedPlace, message: "Place deleted!" };
    }
}