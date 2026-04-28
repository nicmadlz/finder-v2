import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PlaceEntity } from "./place.entity";
import { Repository } from "typeorm";
import { UpdatePlaceDto } from "src/place/dto/UpdatePlace.dto";
import { CreatePlaceDto } from "src/place/dto/CreatePlace.dto";

@Injectable()
export class PlaceService {
    constructor(
        @InjectRepository(PlaceEntity)
        private readonly placeRepository: Repository<PlaceEntity>
    ) { }

    async listPlaces() {
        const savedPlaces = await this.placeRepository.find();

        return savedPlaces;
    }

    async createPlace(placeData: CreatePlaceDto) {
        const exist = await this.placeRepository.findOne({ where: { name: placeData.name } });

        if (exist) {
            throw new ConflictException("This place has already been created!");
        }

        const place = Object.assign(new PlaceEntity(), placeData);
        return await this.placeRepository.save(place);
    }

    async updatePlace(id: number, placeData: UpdatePlaceDto) {
        return await this.placeRepository.update(id, placeData);
    }

    async deletePlace(id: number) {
        return await this.placeRepository.delete(id);
    }
}