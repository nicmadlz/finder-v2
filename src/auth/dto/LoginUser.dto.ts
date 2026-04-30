import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginUserDto {

    @IsEmail({}, { message: "Email must be valid" })
    email!: string;

    @IsNotEmpty({ message: "Password must have content" })
    password!: string;
}