import { Module } from '@nestjs/common';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaceEntity } from './place.entity';
import { AuthModule } from 'src/auth/auth.module';
import { GatewayModule } from 'src/gateway/gateway.module';
import { AddressEntity } from 'src/address/address.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlaceEntity, AddressEntity]),
    AuthModule,
    GatewayModule,
  ],
  controllers: [PlaceController],
  providers: [PlaceService],
})
export class PlaceModule {}
