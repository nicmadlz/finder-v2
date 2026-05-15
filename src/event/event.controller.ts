import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateEventDto } from './dto/CreateEvent.dto';
import { JwtAuthGuard, JwtPayload } from 'src/auth/guards/jwt-auth.guard';
import { EventService } from './event.service';

@Controller('/events')
export class EventController {
  constructor(private eventService: EventService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createEvent(
    @Body() eventData: CreateEventDto,
    @Request() req: { user: JwtPayload },
  ) {
    const user = req.user;

    const response = await this.eventService.createEvent(eventData, user);

    return response;
  }

  @Get()
  async listEvents() {
    return await this.eventService.listEvents();
  }
}
