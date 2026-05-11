import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CreateUserDto } from "./dto/CreateUser.dto";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/LoginUser.dto";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Role } from "./enums/role.enum";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { Roles } from "./decorators/roles.decorator";
import { UpdateRoleDto } from "./dto/UpdateRole.dto";

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
                name: createdUser.name
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

    @ApiBearerAuth()
    @ApiOperation({ summary: "Update a user's role (admin only)" })
    @ApiResponse({ status: 200, description: "Role updated" })
    @ApiResponse({ status: 400, description: "Invalid role" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 403, description: "Forbidden — admin role required" })
    @ApiResponse({ status: 404, description: "User not found" })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Patch("/:id/role")
    async addAdmin(@Param("id") id: string, @Body() body: UpdateRoleDto) {
        return await this.authService.updateRole(id, body);
    }

    @ApiOperation({ summary: "List all users" })
    @ApiResponse({ status: 200, description: "Returns the list of users (id, name, role)" })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get()
    async listUsers() {
        return await this.authService.listUsers();
    }

}