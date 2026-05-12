import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlaceEntity } from './place.entity';
import { Repository } from 'typeorm';
import { UpdatePlaceDto } from 'src/place/dto/UpdatePlace.dto';
import { CreatePlaceDto } from 'src/place/dto/CreatePlace.dto';
import { AddressEntity } from 'src/address/address.entity';
import { AppGateway } from 'src/gateway/app.gateway';

@Injectable()
export class PlaceService {
  constructor(
    @InjectRepository(PlaceEntity)
    private readonly placeRepository: Repository<PlaceEntity>,
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
    private appGateway: AppGateway,
  ) {}

  async listPlaces(page: number, pageSize: number) {
    const [data, total] = await this.placeRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      data: data,
      total: total,
      hasNext: page * pageSize < total,
      page: page,
      pageSize: pageSize,
    };
  }

  async findPlace(id: number) {
    const place = await this.placeRepository.findOne({ where: { id } });
    if (!place) {
      throw new NotFoundException(`Place with id ${id} not found`);
    }
    return place;
  }

  async createPlace(placeData: CreatePlaceDto) {
    const existPlace = await this.placeRepository.findOne({
      where: { name: placeData.name },
    });
    if (existPlace) {
      throw new ConflictException('This place has already been created!');
    }

    const existAddress = await this.addressRepository.findOne({
      where: {
        street: placeData.address.street,
        number: placeData.address.number,
      },
    });
    if (existAddress) {
      throw new ConflictException('This address has already been created!');
    }

    const address = Object.assign(new AddressEntity(), placeData.address);
    const place = Object.assign(new PlaceEntity(), {
      name: placeData.name,
      category: placeData.category,
      priceRange: placeData.priceRange,
      rating: placeData.rating,
      address,
    });

    try {
      const result = await this.placeRepository.save(place);
      this.appGateway.sendPlaceUpdate(result);
      return result;
    } catch {
      throw new InternalServerErrorException('Failed to create place!');
    }
  }

  async updatePlace(id: number, placeData: UpdatePlaceDto) {
    const place = await this.findPlace(id);

    if (placeData.name) {
      const exist = await this.placeRepository.findOne({
        where: { name: placeData.name },
      });
      if (exist && exist.id !== id) {
        throw new ConflictException('This place name is already in use!');
      }
    }

    const { address: addressData, ...placeFields } = placeData;
    Object.assign(place, placeFields);

    if (addressData) {
      Object.assign(place.address, addressData);
    }

    try {
      return await this.placeRepository.save(place);
    } catch {
      throw new InternalServerErrorException('Failed to update place');
    }
  }

  async deletePlace(id: number) {
    const place = await this.findPlace(id);
    try {
      return await this.placeRepository.remove(place);
    } catch {
      throw new InternalServerErrorException('Failed to delete place');
    }
  }
}
