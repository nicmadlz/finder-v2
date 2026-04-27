import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class UpdateAddress{

    @IsNotEmpty({ message: "Street must have content"})
    @IsOptional()
    street!: string;

    @IsNumber(undefined, { message: "Number must be a number"})
    @IsOptional()
    number!: number;

    @IsNotEmpty({message: "Neighborhood must have content"})
    @IsOptional()
    neighborhood!: string;

    @IsNumber(undefined, {message: "Cep must be a number"})
    @IsOptional()
    cep!: number;
}
