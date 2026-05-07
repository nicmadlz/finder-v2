import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateAddressDto{

    @ApiProperty({ description: "Street name", example: "Rua das Flores" })
    @IsNotEmpty({ message: "Street must have content"})
    street!: string;

    @ApiProperty({ description: "Street number", example: 123 })
    @IsNumber(undefined, { message: "Number must be a number"})
    number!: number;

    @ApiProperty({ description: "Neighborhood name", example: "Centro" })
    @IsNotEmpty({message: "Neighborhood must have content"})
    neighborhood!: string;

    @ApiProperty({ description: "Postal code (CEP)", example: 90010000 })
    @IsNumber(undefined, {message: "Cep must be a number"})
    cep!: number;
}
