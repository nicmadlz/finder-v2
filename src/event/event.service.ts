import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from './event.entity';
import { Repository } from 'typeorm';
import { AttendanceEntity } from './attendance.entity';
import { CreateEventDto } from './dto/CreateEvent.dto';
import { PlaceEntity } from 'src/place/place.entity';
import { JwtPayload } from 'src/auth/guards/jwt-auth.guard';
import { UserEntity } from 'src/auth/user.entity';
import { Role } from './enums/role.enum';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
    @InjectRepository(AttendanceEntity)
    private readonly attendanceRepository: Repository<AttendanceEntity>,
    @InjectRepository(PlaceEntity)
    private readonly placeRepository: Repository<PlaceEntity>,
  ) {}

  async createEvent(eventData: CreateEventDto, user: JwtPayload) {
    const existPlace = await this.placeRepository.findOne({
      where: { id: eventData.place_id },
    });

    if (!existPlace) {
      throw new NotFoundException('This place doesn`t exist!');
    }

    const event = Object.assign(new EventEntity(), {
      name: eventData.name,
      description: eventData.description,
      start_at: eventData.start_at,
      duration_minutes: eventData.duration_minutes,
      max_capacity: eventData.max_capacity,
      place: existPlace,
      created_by: { id: user.sub } as unknown as UserEntity,
    });

    const attendance = Object.assign(new AttendanceEntity(), {
      user: { id: user.sub } as unknown as UserEntity,
      event: event,
      role: Role.CREATOR,
    });

    try {
      await this.eventRepository.save(event);
      await this.attendanceRepository.save(attendance);
      return 'You created an event!';
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to create event!');
    }
  }
}
