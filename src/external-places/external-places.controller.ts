import { Controller, Get, Query } from "@nestjs/common";
import { ExternalPlacesService } from "./external-places.service";

@Controller("/external-places")
export class ExternalPlacesController{

    constructor(private externalPlaceService: ExternalPlacesService) {}
    
    @Get()
    async search(@Query("q") q: string, @Query("city") city: string){
        const result = await this.externalPlaceService.search(q, city);
        return result;
    }
}