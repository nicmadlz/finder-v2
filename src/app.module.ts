import { Module } from '@nestjs/common';
import { AddressModule } from './address/address.module';
import { PlaceModule } from './place/place.module';

@Module({
  imports: [AddressModule, PlaceModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
