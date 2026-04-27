import { Module } from '@nestjs/common';
import { PlaceController } from './place.controller';
import { PlaceRepository } from './place.repository';

@Module({
  controllers: [PlaceController],
  providers: [PlaceRepository],
})
export class PlaceModule {}
