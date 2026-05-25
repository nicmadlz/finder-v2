import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateEventDto } from './dto/CreateEvent.dto';
import { JwtAuthGuard, JwtPayload } from 'src/auth/guards/jwt-auth.guard';
import { EventService } from './event.service';
import { UpdateEventDto } from './dto/UpdateEvent.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiCreateEvent,
  ApiListEvents,
  ApiAttendEvent,
  ApiUnsubscribeEvent,
  ApiDeleteEvent,
  ApiUpdateEvent,
} from './decorators/event-api.decorator';

@ApiTags('Events')
@Controller('/events')
export class EventController {
  constructor(private eventService: EventService) {}

  @ApiCreateEvent()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createEvent(
    @Body() eventData: CreateEventDto,
    @Request() req: { user: JwtPayload },
  ) {
    const user = req.user;
    return await this.eventService.createEvent(eventData, user);
  }

  @ApiListEvents()
  @Get()
  async listEvents() {
    return await this.eventService.listEvents();
  }

  @ApiAttendEvent()
  @UseGuards(JwtAuthGuard)
  @Post('/:id/attend')
  async attendsAnEvent(
    @Param('id') id: number,
    @Request() req: { user: JwtPayload },
  ) {
    const user = req.user;
    return await this.eventService.attendAnEvent(+id, user);
  }

  @ApiUnsubscribeEvent()
  @UseGuards(JwtAuthGuard)
  @Delete('/:id/attend')
  async unSubscribe(
    @Param('id') id: number,
    @Request() req: { user: JwtPayload },
  ) {
    const user = req.user;
    return await this.eventService.unSubscribe(+id, user);
  }

  @ApiDeleteEvent()
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteEvent(
    @Param('id') id: number,
    @Request() req: { user: JwtPayload },
  ) {
    const user = req.user;
    return await this.eventService.deleteEvent(+id, user);
  }

  @ApiUpdateEvent()
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async updateEvent(
    @Param('id') id: number,
    @Request() req: { user: JwtPayload },
    @Body() eventBody: UpdateEventDto,
  ) {
    const user = req.user;
    return await this.eventService.updateEvent(+id, user, eventBody);
  }
}
