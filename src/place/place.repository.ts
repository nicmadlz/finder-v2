import { Injectable } from "@nestjs/common";

@Injectable()
export class PlaceRepository{
    private places: any[] = [];

    async save(place){
        this.places.push(place);
        console.log(this.places);
    }

    async list(){
        return this.places;
    }

    async haveAddress(name){
        const possiblePlace = this.places.find(
            place => place.name == name
        );

        return possiblePlace !== undefined;
    }
}