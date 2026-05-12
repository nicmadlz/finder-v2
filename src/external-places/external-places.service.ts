import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, of, retry, timeout } from 'rxjs';
import { ExternalPlaceDto } from './dto/external-place.dto';

interface NominatimRaw {
  display_name: string;
  lat: string;
  lon: string;
  address?: { city?: string; country?: string };
}

@Injectable()
export class ExternalPlacesService {
  constructor(private httpService: HttpService) {}

  async search(q: string, city: string): Promise<ExternalPlaceDto[]> {
    try {
      const query = `${q} ${city}, Brazil`;
      const { data } = await firstValueFrom(
        this.httpService
          .get<NominatimRaw[]>('https://nominatim.openstreetmap.org/search', {
            params: {
              q: query,
              format: 'json',
              limit: 10,
              addressdetails: 1,
            },
            headers: {
              'User-Agent': 'finder-v2/1.0',
            },
          })
          .pipe(
            timeout(3000),
            retry(2),
            catchError((err: Error) => {
              console.log('Nominatim failed: ', err.message);
              return of({ data: [] as NominatimRaw[] });
            }),
          ),
      );

      return data.map((item) => ExternalPlaceDto.fromNominatim(item));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
