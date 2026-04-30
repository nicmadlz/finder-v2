import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {

    @IsNotEmpty({ message: "Name must have content" })
    name!: string;

    @IsEmail({}, { message: "Email must be valid" })
    email!: string;

    @IsNotEmpty({ message: "Password must have content" })
    password!: string;
}