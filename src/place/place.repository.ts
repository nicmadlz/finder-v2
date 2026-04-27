import { Injectable } from "@nestjs/common";
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

    async update(id: number, newData: Partial<PlaceEntity>) {
        const possiblePlace = this.places.find(
            place => place.id === id
        );

        if (!possiblePlace) {
            throw new Error("Place do not exist!")
        }

        Object.entries(newData).forEach(([key, value]) => {

            if (key === "id") {
                return;
            }

            possiblePlace[key] = value;
        });

        return possiblePlace;
    }
}