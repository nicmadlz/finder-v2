import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiCreatePlace() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Create a place' }),
    ApiResponse({
      status: 201,
      description: 'Returns the created place and a success message',
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({
      status: 403,
      description: 'Forbidden — admin role required',
    }),
  );
}

export function ApiListPlaces() {
  return applyDecorators(
    ApiOperation({ summary: 'List all places with pagination' }),
    ApiResponse({
      status: 200,
      description: 'Returns paginated list of places',
    }),
  );
}

export function ApiFindPlace() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a place by ID' }),
    ApiResponse({ status: 200, description: 'Returns the place' }),
    ApiResponse({ status: 404, description: 'Place not found' }),
  );
}

export function ApiUpdatePlace() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update a place by ID' }),
    ApiResponse({
      status: 200,
      description: 'Returns the updated place and a success message',
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({
      status: 403,
      description: 'Forbidden — admin role required',
    }),
    ApiResponse({ status: 404, description: 'Place not found' }),
  );
}

export function ApiDeletePlace() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete a place by ID' }),
    ApiResponse({
      status: 200,
      description: 'Returns the deleted place and a success message',
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({
      status: 403,
      description: 'Forbidden — admin role required',
    }),
    ApiResponse({ status: 404, description: 'Place not found' }),
  );
}
