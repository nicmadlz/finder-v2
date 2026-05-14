import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPostalCode, Min } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({ description: 'Street number', example: 123 })
  @IsNumber(undefined, { message: 'Number must be a number' })
  @Min(1, { message: 'Number must be at least 1' })
  number!: number;

  @ApiProperty({
    description: 'Postal code (CEP, 8 digits)',
    example: 90010000,
  })
  @IsPostalCode('BR')
  cep!: string;
}
