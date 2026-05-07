import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDefined, IsNotEmpty, IsNumber, IsString, MaxLength, ValidateNested } from "class-validator";
import { CreateAddressDto } from "src/address/dto/CreateAddress.dto";

export class CreatePlaceDto {

    @ApiProperty({ description: "Place name", example: "Café do Mercado"})
    @IsNotEmpty({ message: "Name must have content" })
    @IsString()
    name!: string;

    @ApiProperty({ description: "Place category", example: "Restaurant" })
    @MaxLength(30, { message: "Category must not have more than 30 characters" })
    @IsNotEmpty({ message: "Category must not be empty" })
    @IsString()
    category!: string;

    @ApiProperty({ description: "Price range from 1 (cheap) to 5 (expensive)", example: 3 })
    @IsNumber({}, { message: "Price Range must be a number" })
    priceRange!: number;

    @ApiProperty({ description: "Average rating from 0 to 5", example: 4.5 })
    @IsNumber({}, { message: "Rating must be a number" })
    rating!: number;

    @ApiProperty({ description: "Address of the place", type: () => CreateAddressDto })
    @IsDefined({ message: "Address must be provided" })
    @ValidateNested()
    @Type(() => CreateAddressDto)
    address!: CreateAddressDto;
}