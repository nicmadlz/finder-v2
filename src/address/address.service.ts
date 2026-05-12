import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressEntity } from './address.entity';
import { Repository } from 'typeorm';
import { UpdateAddressDto } from 'src/address/dto/UpdateAddress.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
  ) {}

  async listAddresses() {
    return await this.addressRepository.find();
  }

  async findAddress(id: number) {
    const address = await this.addressRepository.findOne({ where: { id } });
    if (!address) {
      throw new NotFoundException(`Address with id ${id} not found`);
    }
    return address;
  }

  async updateAddress(id: number, addressData: UpdateAddressDto) {
    const address = await this.findAddress(id);
    Object.assign(address, addressData);
    try {
      return await this.addressRepository.save(address);
    } catch {
      throw new InternalServerErrorException('Failed to update address');
    }
  }
}
