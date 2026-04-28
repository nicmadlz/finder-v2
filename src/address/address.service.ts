import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AddressEntity } from "./address.entity";
import { Repository } from "typeorm";
import { UpdateAddressDto } from "src/address/dto/UpdateAddress.dto";
import { CreateAddressDto } from "src/address/dto/CreateAddress.dto";

@Injectable()
export class AddressService {
    constructor(
        @InjectRepository(AddressEntity)
        private readonly addressRepository: Repository<AddressEntity>
    ) { }

    async listAddresses() {
        const savedAddresses = await this.addressRepository.find();

        return savedAddresses;
    }

    async createAddress(addressData: CreateAddressDto) {
        const exist = await this.addressRepository.findOne({ where: {
             street: addressData.street,
             number: addressData.number}
            });

        if (exist) {
            throw new ConflictException("This address has already been created!");
        }

        const address = Object.assign(new AddressEntity(), addressData);
        return await this.addressRepository.save(address);
    }

    async updateAddress(id: number, addressData: UpdateAddressDto) {
        return await this.addressRepository.update(id, addressData);
    }

    async deleteAddress(id: number) {
        return await this.addressRepository.delete(id);
    }
}