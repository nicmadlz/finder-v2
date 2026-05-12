import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({ description: 'Street name', example: 'Rua das Flores' })
  @IsNotEmpty({ message: 'Street must have content' })
  street!: string;

  @ApiProperty({ description: 'Street number', example: 123 })
  @IsNumber(undefined, { message: 'Number must be a number' })
  @Min(1, { message: 'Number must be at least 1' })
  number!: number;

  @ApiProperty({ description: 'Neighborhood name', example: 'Centro' })
  @IsNotEmpty({ message: 'Neighborhood must have content' })
  neighborhood!: string;

  @ApiProperty({
    description: 'Postal code (CEP, 8 digits)',
    example: 90010000,
  })
  @IsNumber(undefined, { message: 'Cep must be a number' })
  @Min(10000000, { message: 'Cep must have 8 digits' })
  @Max(99999999, { message: 'Cep must have 8 digits' })
  cep!: number;
}
