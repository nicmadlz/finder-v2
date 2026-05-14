import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPostalCode, Min } from 'class-validator';

export class UpdateAddressDto {
  @ApiProperty({ description: 'Street number', example: 123, required: false })
  @IsNumber(undefined, { message: 'Number must be a number' })
  @Min(1, { message: 'Number must be at least 1' })
  @IsOptional()
  number?: number;

  @ApiProperty({
    description: 'Postal code (CEP, 8 digits)',
    example: 90010000,
    required: false,
  })
  @IsPostalCode('BR')
  @IsOptional()
  cep?: string;
}
