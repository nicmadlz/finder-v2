import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateAddressDTO{

    @IsNotEmpty({ message: "Street must have content"})
    street!: string;

    @IsNumber(undefined, { message: "Number must be a number"})
    number!: number;

    @IsNotEmpty({message: "Neighborhood must have content"})
    neighborhood!: string;

    @IsNumber(undefined, {message: "Cep must be a number"})
    cep!: number;
}
