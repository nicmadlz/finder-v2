import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: "User's full name", example: 'John Doe' })
  @IsNotEmpty({ message: 'Name must have content' })
  name!: string;

  @ApiProperty({
    description: "User's email address",
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: 'Email must be valid' })
  email!: string;
}
