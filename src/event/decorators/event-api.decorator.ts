import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiCreateEvent() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Create an event' }),
    ApiResponse({
      status: 201,
      description: 'Returns the created event',
    }),
    ApiResponse({ status: 400, description: 'Invalid request body' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}

export function ApiListEvents() {
  return applyDecorators(
    ApiOperation({ summary: 'List all events' }),
    ApiResponse({ status: 200, description: 'Returns the list of events' }),
  );
}

export function ApiAttendEvent() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Attend an event' }),
    ApiResponse({
      status: 201,
      description: 'Successfully subscribed to the event',
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 404, description: 'Event not found' }),
    ApiResponse({
      status: 409,
      description: 'Already subscribed to this event',
    }),
  );
}

export function ApiUnsubscribeEvent() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Unsubscribe from an event' }),
    ApiResponse({
      status: 200,
      description: 'Successfully unsubscribed from the event',
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 404, description: 'Event not found' }),
  );
}

export function ApiDeleteEvent() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete an event by ID' }),
    ApiResponse({
      status: 200,
      description: 'Returns the deleted event and a success message',
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({
      status: 403,
      description: 'Forbidden — only the event owner can delete it',
    }),
    ApiResponse({ status: 404, description: 'Event not found' }),
  );
}

export function ApiUpdateEvent() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update an event by ID' }),
    ApiResponse({
      status: 200,
      description: 'Returns the updated event and a success message',
    }),
    ApiResponse({ status: 400, description: 'Invalid request body' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({
      status: 403,
      description: 'Forbidden — only the event owner can update it',
    }),
    ApiResponse({ status: 404, description: 'Event not found' }),
  );
}
