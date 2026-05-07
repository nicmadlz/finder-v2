import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { catchError, firstValueFrom, of, retry, timeout } from "rxjs";
import { ExternalPlaceDto } from "./dto/external-place.dto";

@Injectable()
export class ExternalPlacesService {
    constructor(
        private httpService: HttpService
    ) { }

    async search(q: string, city: string) {
        try {
            const query = `${q} ${city}, Brazil`;
            const { data } = await firstValueFrom(this.httpService.get("https://nominatim.openstreetmap.org/search", {
                params: {
                    q: query,
                    format: "json",
                    limit: 10,
                    addressdetails: 1
                },
                headers: {
                    "User-Agent": "finder-v2/1.0"
                }
            }).pipe(
                timeout(3000),
                retry(2),
                catchError(err => {
                    console.log("Nominatim failed: ", err.message)
                    return of({ data: [] });
                })
            ))

            const result = data.map(item => ExternalPlaceDto.fromNominatim(item));
            return result;
        }catch(error){
            console.log(error);
            throw error;
        }
    }
}