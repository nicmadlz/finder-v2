import { Controller, Get, Query } from '@nestjs/common';
import { ExternalPlacesService } from './external-places.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchExternalPlacesDto } from './dto/search-external-places.dto';

@ApiTags('External Places')
@Controller('/external-places')
export class ExternalPlacesController {
  constructor(private externalPlaceService: ExternalPlacesService) {}

  @ApiOperation({ summary: 'Search external places by query and city' })
  @ApiResponse({
    status: 200,
    description: 'Returns the list of external places matching the search',
  })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  @Get()
  async search(@Query() query: SearchExternalPlacesDto) {
    const result = await this.externalPlaceService.search(query.q, query.city);
    return result;
  }
}
