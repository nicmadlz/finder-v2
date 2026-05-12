import { ApiProperty } from '@nestjs/swagger';

interface NominatimRaw {
  display_name: string;
  lat: string;
  lon: string;
  address?: { city?: string; country?: string };
}

export class ExternalPlaceDto {
  @ApiProperty({ description: 'Place name', example: 'Café do Mercado' })
  name!: string;

  @ApiProperty({ description: 'Latitude coordinate', example: '-30.0277' })
  latitude!: string;

  @ApiProperty({ description: 'Longitude coordinate', example: '-51.2287' })
  longitude!: string;

  @ApiProperty({ description: 'City name', example: 'Porto Alegre' })
  city!: string;

  @ApiProperty({ description: 'Country name', example: 'Brazil' })
  country!: string;

  static fromNominatim(raw: NominatimRaw): ExternalPlaceDto {
    const dto = new ExternalPlaceDto();
    dto.name = raw.display_name.split(',')[0];
    dto.latitude = raw.lat;
    dto.longitude = raw.lon;
    dto.city = raw.address?.city ?? '';
    dto.country = raw.address?.country ?? '';
    return dto;
  }
}
