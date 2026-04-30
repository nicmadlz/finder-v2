import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserDto } from "./dto/CreateUser.dto";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/LoginUser.dto";

@Controller("/auth")
export class AuthController{
    constructor( private authService: AuthService) {}

    @Post("/register")
    async registerUser(@Body() userData: CreateUserDto){
        const createdUser = await this.authService.registerUser(userData);

        return {
            user: {
                name: createdUser.name,
                email: createdUser.email
            },
            message: "User created!"
        }
    }

    @Post("/login")
    async loginUser(@Body() userData: LoginUserDto){
        const token = await this.authService.loginUser(userData);

        return {
            token: token,
            message: "You're logged in!"
        }
    }
}