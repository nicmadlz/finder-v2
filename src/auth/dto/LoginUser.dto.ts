import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginUserDto {

    @ApiProperty({ description: "User's email address", example: "john.doe@example.com" })
    @IsEmail({}, { message: "Email must be valid" })
    email!: string;

    @ApiProperty({ description: "User's password", example: "StrongP@ssw0rd" })
    @IsNotEmpty({ message: "Password must have content" })
    password!: string;
}