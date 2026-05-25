import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiListAddresses() {
  return applyDecorators(
    ApiOperation({ summary: 'List all addresses' }),
    ApiResponse({ status: 200, description: 'Returns the list of addresses' }),
  );
}

export function ApiFindAddress() {
  return applyDecorators(
    ApiOperation({ summary: 'Get an address by ID' }),
    ApiResponse({ status: 200, description: 'Returns the address' }),
    ApiResponse({ status: 404, description: 'Address not found' }),
  );
}

export function ApiUpdateAddress() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update an address by ID' }),
    ApiResponse({
      status: 200,
      description: 'Returns the updated address and a success message',
    }),
    ApiResponse({ status: 400, description: 'Invalid request body' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({
      status: 403,
      description: 'Forbidden — admin role required',
    }),
    ApiResponse({ status: 404, description: 'Address not found' }),
  );
}
