import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, Max, Min } from "class-validator";

export class UpdateAddressDto{

    @ApiProperty({ description: "Street name", example: "Rua das Flores", required: false })
    @IsNotEmpty({ message: "Street must have content"})
    @IsOptional()
    street?: string;

    @ApiProperty({ description: "Street number", example: 123, required: false })
    @IsNumber(undefined, { message: "Number must be a number"})
    @Min(1, { message: "Number must be at least 1" })
    @IsOptional()
    number?: number;

    @ApiProperty({ description: "Neighborhood name", example: "Centro", required: false })
    @IsNotEmpty({message: "Neighborhood must have content"})
    @IsOptional()
    neighborhood?: string;

    @ApiProperty({ description: "Postal code (CEP, 8 digits)", example: 90010000, required: false })
    @IsNumber(undefined, {message: "Cep must be a number"})
    @Min(10000000, { message: "Cep must have 8 digits" })
    @Max(99999999, { message: "Cep must have 8 digits" })
    @IsOptional()
    cep?: number;
}
