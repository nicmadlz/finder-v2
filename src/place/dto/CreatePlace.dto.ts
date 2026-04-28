import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

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
}