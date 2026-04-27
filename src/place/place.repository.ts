import { Injectable, NotFoundException } from "@nestjs/common";
import { PlaceEntity } from "./place.entity";

@Injectable()
export class PlaceRepository {
    private places: PlaceEntity[] = [];
    private nextId = 1;

    async save(place: PlaceEntity): Promise<PlaceEntity> {
        place.id = this.nextId++;
        this.places.push(place);
        return place;
    }

    async list() {
        return this.places;
    }

    async haveAddress(name: string) {
        const possiblePlace = this.places.find(
            place => place.name == name
        );

        return possiblePlace !== undefined;
    }

    async searchId(id: number){
        const possiblePlace = this.places.find(
            place => place.id === id
        );

        if (!possiblePlace) {
            throw new NotFoundException("Place do not exist!")
        }

        return possiblePlace;
    }

    async update(id: number, newData: Partial<PlaceEntity>) {

        const place = this.searchId(id);

        Object.entries(newData).forEach(([key, value]) => {

            if (key === "id") {
                return;
            }

            place[key] = value;
        });

        return place;
    }

    async delete(id: number){

        await this.searchId(id);

        this.places = this.places.filter(
            savePlace => savePlace.id !== id
        )

        return this.places;
    }
}