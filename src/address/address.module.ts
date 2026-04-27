import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';
import { AddressRepository } from './address.repository';

@Module({
  controllers: [AddressController],
  providers: [AddressRepository],
})
export class AddressModule {}
