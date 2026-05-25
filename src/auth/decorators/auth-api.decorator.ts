import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiRegisterUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Register a new user' }),
    ApiResponse({ status: 201, description: 'Returns the created user' }),
    ApiResponse({ status: 400, description: 'Invalid request body' }),
    ApiResponse({ status: 409, description: 'Email already in use' }),
  );
}

export function ApiLoginUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Log in an existing user' }),
    ApiResponse({
      status: 200,
      description: 'Returns the JWT token and a success message',
    }),
    ApiResponse({ status: 400, description: 'Invalid request body' }),
    ApiResponse({ status: 401, description: 'Invalid email or password' }),
  );
}

export function ApiChangePassword() {
  return applyDecorators(
    ApiOperation({ summary: 'Change user password' }),
    ApiResponse({ status: 200, description: 'Password changed successfully' }),
    ApiResponse({ status: 400, description: 'Invalid request body' }),
    ApiResponse({ status: 401, description: 'Current password is incorrect' }),
    ApiResponse({ status: 404, description: 'User not found' }),
  );
}

export function ApiAddAdmin() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: "Update a user's role (admin only)" }),
    ApiResponse({ status: 200, description: 'Role updated' }),
    ApiResponse({ status: 400, description: 'Invalid role' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({
      status: 403,
      description: 'Forbidden — admin role required',
    }),
    ApiResponse({ status: 404, description: 'User not found' }),
  );
}

export function ApiListUsers() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'List all users' }),
    ApiResponse({
      status: 200,
      description: 'Returns the list of users (id, name, role)',
    }),
  );
}
