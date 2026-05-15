import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceEntity } from './attendance.entity';
import { EventEntity } from './event.entity';
import { PlaceEntity } from '../place/place.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AttendanceEntity, EventEntity, PlaceEntity]),
    AuthModule,
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
