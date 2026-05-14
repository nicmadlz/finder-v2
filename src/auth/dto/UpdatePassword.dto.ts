import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: "User's password (min 8 characters)",
    example: 'StrongP@ssw0rd',
  })
  @IsNotEmpty({ message: 'Password must have content' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  generatedPassword!: string;

  @IsNotEmpty({ message: 'Password must have content' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  newPassword!: string;
}
