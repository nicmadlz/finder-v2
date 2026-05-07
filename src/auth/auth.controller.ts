import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CreateUserDto } from "./dto/CreateUser.dto";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/LoginUser.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Role } from "./enums/role.enum";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { Roles } from "./decorators/roles.decorator";

@ApiTags("Auth")
@Controller("/auth")
export class AuthController {
    constructor(private authService: AuthService) { }

    @ApiOperation({ summary: "Register a new user" })
    @ApiResponse({ status: 201, description: "Returns the created user and a success message" })
    @ApiResponse({ status: 400, description: "Invalid request body" })
    @ApiResponse({ status: 409, description: "Email already in use" })
    @Post("/register")
    async registerUser(@Body() userData: CreateUserDto) {
        const createdUser = await this.authService.registerUser(userData);

        return {
            user: {
                name: createdUser.name,
                email: createdUser.email
            },
            message: "User created!"
        }
    }

    @ApiOperation({ summary: "Log in an existing user" })
    @ApiResponse({ status: 201, description: "Returns the JWT token and a success message" })
    @ApiResponse({ status: 400, description: "Invalid request body" })
    @ApiResponse({ status: 401, description: "Invalid email or password" })
    @Post("/login")
    async loginUser(@Body() userData: LoginUserDto) {
        const token = await this.authService.loginUser(userData);

        return {
            token: token,
            message: "You're logged in!"
        }
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Patch("/:id/role")
    async addAdmin(@Param("id") id: string, @Body("role") role: Role) {
        return await this.authService.updateRole(id, role);
    }

    @Get()
    async listUsers() {
        return await this.authService.listUsers();
    }

}