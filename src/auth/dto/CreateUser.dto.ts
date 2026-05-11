import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreateUserDto {

    @ApiProperty({ description: "User's full name", example: "John Doe" })
    @IsNotEmpty({ message: "Name must have content" })
    name!: string;

    @ApiProperty({ description: "User's email address", example: "john.doe@example.com" })
    @IsEmail({}, { message: "Email must be valid" })
    email!: string;

    @ApiProperty({ description: "User's password (min 8 characters)", example: "StrongP@ssw0rd" })
    @IsNotEmpty({ message: "Password must have content" })
    @MinLength(8, { message: "Password must be at least 8 characters" })
    password!: string;
}