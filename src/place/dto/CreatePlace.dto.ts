import { Type } from "class-transformer";
import { IsDefined, IsNotEmpty, IsNumber, IsString, MaxLength, ValidateNested } from "class-validator";
import { CreateAddressDto } from "src/address/dto/CreateAddress.dto";

export class CreatePlaceDto {

    @IsNotEmpty({ message: "Name must have content" })
    @IsString()
    name!: string;

    @MaxLength(30, { message: "Category must not have more than 30 characters" })
    @IsNotEmpty({ message: "Category must not be empty" })
    @IsString()
    category!: string;

    @IsNumber({}, { message: "Price Range must be a number" })
    priceRange!: number;

    @IsNumber({}, { message: "Rating must be a number" })
    rating!: number;

    @IsDefined({ message: "Address must be provided" })
    @ValidateNested()
    @Type(() => CreateAddressDto)
    address!: CreateAddressDto;
}