import { Body, ConflictException, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { PlaceRepository } from "./place.repository";
import { PlaceEntity } from "./place.entity";
import { CreatePlaceDTO } from "./dto/CreatePlace.dto";
import { UpdatePlace } from "./dto/UpdatePlace.dto";

@Controller("/places")
export class PlaceController {

    constructor(private placeRepository: PlaceRepository) { }

    @Post()
    async createPlace(@Body() placeData: CreatePlaceDTO) {
        const exist = await this.placeRepository.haveAddress(placeData.name);
        if (!exist) {
            const place = Object.assign(new PlaceEntity(), placeData);
            return this.placeRepository.save(place);
        }
        throw new ConflictException("This place has already been created!")
    }

    @Get()
    async listPlaces() {
        return this.placeRepository.list();
    }

    @Put("/:id")
    async updatePlace(@Param("id") id: number, @Body() newData: UpdatePlace) {

        const updatedPlace = await this.placeRepository.update(id, newData);

        return {
            place: updatedPlace,
            message: "Place updated!"
        }
    }

    @Delete("/:id")
    async deletePlace(@Param("id") id: number){
        const deletedPlace = await this.placeRepository.delete(id);
        
        return {
            place: deletedPlace,
            message: "Place deleted!"
        }
    }
}