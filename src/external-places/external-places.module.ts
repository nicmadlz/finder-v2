import { Module } from '@nestjs/common';
import { ExternalPlacesController } from './external-places.controller';
import { ExternalPlacesService } from './external-places.service';
import { HttpModule } from "@nestjs/axios"

@Module({
  imports: [HttpModule],
  controllers: [ExternalPlacesController],
  providers: [ExternalPlacesService],
})
export class ExternalPlacesModule {}
