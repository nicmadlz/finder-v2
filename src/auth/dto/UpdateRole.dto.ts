import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '../enums/role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto {
  @ApiProperty({ description: 'User role', example: 'Admin', required: true })
  @IsNotEmpty({ message: 'Role must have content' })
  @IsEnum(Role)
  role!: Role;
}
