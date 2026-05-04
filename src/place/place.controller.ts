import { Body, ConflictException, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { CreatePlaceDto } from "./dto/CreatePlace.dto";
import { UpdatePlaceDto } from "./dto/UpdatePlace.dto";
import { PlaceService } from "./place.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@Controller("/places")
export class PlaceController {

    constructor(
        private placeService: PlaceService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createPlace(@Body() placeData: CreatePlaceDto) {
        const createdPlace = await this.placeService.createPlace(placeData);
        return {
            createdPlace: createdPlace,
            message: "Place created!"
        }
    }

    @Get()
    async listPlaces() {
        return await this.placeService.listPlaces();
    }

    @Get("/:id")
    async findPlace(@Param("id") id: number) {
        return await this.placeService.findPlace(id);
    }

    @UseGuards(JwtAuthGuard)
    @Put("/:id")
    async updatePlace(@Param("id") id: number, @Body() newData: UpdatePlaceDto) {
        const updatedPlace = await this.placeService.updatePlace(id, newData);
        return {
            place: updatedPlace,
            message: "Place updated!"
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete("/:id")
    async deletePlace(@Param("id") id: number) {
        const deletedPlace = await this.placeService.deletePlace(id);
        return {
            place: deletedPlace,
            message: "Place deleted!"
        }
    }
}