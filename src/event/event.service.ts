import {
  ConflictException,
  ForbiddenException,
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

    const userAttendances = await this.attendanceRepository.find({
      where: { user: { id: user.sub } },
      relations: ['event'],
    });

    const newStart = new Date(eventData.start_at).getTime();
    const newEnd = newStart + eventData.duration_minutes * 60000;

    for (const attendance of userAttendances) {
      const existingStart = new Date(attendance.event.start_at).getTime();
      const existingEnd =
        existingStart + attendance.event.duration_minutes * 60000;

      if (newStart < existingEnd && newEnd > existingStart) {
        throw new ConflictException('You already have an event at this time!');
      }
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

  async listEvents() {
    try {
      return await this.eventRepository.find({ relations: ['place'] });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to list events');
    }
  }

  async attendAnEvent(eventId: number, user: JwtPayload) {
    const eventExist = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!eventExist) {
      throw new NotFoundException('This event doesn`t exists');
    }

    const count = await this.attendanceRepository.count({
      where: { event: { id: eventId } },
    });

    if (count >= eventExist.max_capacity) {
      throw new ConflictException('This event is already full!');
    }

    const userAttendances = await this.attendanceRepository.find({
      where: { user: { id: user.sub } },
      relations: ['event'],
    });

    const newStart = new Date(eventExist.start_at).getTime();
    const newEnd = newStart + eventExist.duration_minutes * 60000;

    for (const attendance of userAttendances) {
      const existingStart = new Date(attendance.event.start_at).getTime();
      const existingEnd =
        existingStart + attendance.event.duration_minutes * 60000;

      if (newStart < existingEnd && newEnd > existingStart) {
        throw new ConflictException('You already have an event at this time!');
      }
    }

    const attendance = Object.assign(new AttendanceEntity(), {
      user: { id: user.sub } as unknown as UserEntity,
      event: eventExist,
      role: Role.ATTENDEE,
    });

    try {
      return await this.attendanceRepository.save(attendance);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Failed to attend you to the event!',
      );
    }
  }

  async deleteEventAttend(eventId: number, user: JwtPayload) {
    const eventExist = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!eventExist) {
      throw new NotFoundException('This event doesn`t exists');
    }

    const attendance = await this.attendanceRepository.findOne({
      where: { user: { id: user.sub }, event: { id: eventId } },
    });

    if (!attendance) {
      throw new NotFoundException('You are not registered in this event!');
    }

    if (attendance.role !== Role.ATTENDEE) {
      throw new ForbiddenException('You are the creator of the event!');
    }

    return await this.attendanceRepository.remove(attendance);
  }
}
