import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, ValidateNested } from "class-validator";
import { UpdateAddressDto } from "src/address/dto/UpdateAddress.dto";

export class UpdatePlaceDto {

    @ApiProperty({ description: "Place name", example: "Café do Mercado", required: false })
    @IsNotEmpty({ message: "Name must have content" })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ description: "Place category", example: "Restaurant", required: false })
    @MaxLength(30, { message: "Category must not have more than 30 characters" })
    @IsNotEmpty({ message: "Category must not be empty" })
    @IsString()
    @IsOptional()
    category?: string;

    @ApiProperty({ description: "Price range from 1 (cheap) to 5 (expensive)", example: 3, required: false })
    @IsNumber({}, { message: "Price Range must be a number" })
    @IsOptional()
    priceRange?: number;

    @ApiProperty({ description: "Average rating from 0 to 5", example: 4.5, required: false })
    @IsNumber({}, { message: "Rating must be a number" })
    @IsOptional()
    rating?: number;

    @ApiProperty({ description: "Address of the place", type: () => UpdateAddressDto, required: false })
    @ValidateNested()
    @Type(() => UpdateAddressDto)
    @IsOptional()
    address?: UpdateAddressDto;
}