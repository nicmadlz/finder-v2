export class ExternalPlaceDto{

    name!: string;
    latitude!: string;
    longitude!: string;
    city!: string;
    country!: string; 

    static fromNominatim(raw: any): ExternalPlaceDto{
        const dto = new ExternalPlaceDto();
        dto.name = raw.display_name.split(",")[0];
        dto.latitude = raw.lat;
        dto.longitude = raw.lon;
        dto.city = raw.address?.city;
        dto.country = raw.address?.country;

        return dto;
    }
}