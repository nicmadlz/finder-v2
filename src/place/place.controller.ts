import { Body, ConflictException, Controller, Get, Post } from "@nestjs/common";
import { PlaceRepository } from "./place.repository";
import { CreatePlaceDTO } from "./dto/CreatePlace.dto";

@Controller("/places")
export class PlaceController{

    constructor(private placeRepository: PlaceRepository) {}

    @Post()
    async createPlace(@Body() placeData: CreatePlaceDTO){
        const exist = await this.placeRepository.haveAddress(placeData.name);
        if(!exist){
            this.placeRepository.save(placeData);
            return placeData;
        }
        throw new ConflictException("This place has already been created!")
    }

    @Get()
    async listPlaces(){
        return this.placeRepository.list();
    }
}