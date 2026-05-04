import { Module } from '@nestjs/common';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaceEntity } from './place.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([PlaceEntity]), AuthModule],
  controllers: [PlaceController],
  providers: [PlaceService],
})
export class PlaceModule {}