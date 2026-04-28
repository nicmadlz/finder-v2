import { Module } from '@nestjs/common';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaceEntity } from './place.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlaceEntity])],
  controllers: [PlaceController],
  providers: [PlaceService],
})
export class PlaceModule {}