import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SearchExternalPlacesDto {
  @ApiProperty({ description: 'Search query', example: 'café' })
  @IsString()
  @IsNotEmpty({ message: 'q must have content' })
  q!: string;

  @ApiProperty({ description: 'City name', example: 'Porto Alegre' })
  @IsString()
  @IsNotEmpty({ message: 'city must have content' })
  city!: string;
}
