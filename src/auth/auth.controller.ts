import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUser.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/LoginUser.dto';
import { ApiTags } from '@nestjs/swagger';
import { Role } from './enums/role.enum';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { UpdateRoleDto } from './dto/UpdateRole.dto';
import { UpdatePasswordDto } from './dto/UpdatePassword.dto';
import {
  ApiAddAdmin,
  ApiChangePassword,
  ApiListUsers,
  ApiLoginUser,
  ApiRegisterUser,
} from './decorators/auth-api.decorator';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiRegisterUser()
  @Post('/register')
  async registerUser(@Body() userData: CreateUserDto) {
    const createdUser = await this.authService.registerUser(userData);

    return {
      user: {
        name: createdUser.name,
      },
      message: 'User created!',
    };
  }

  @ApiLoginUser()
  @HttpCode(200)
  @Post('/login')
  async loginUser(@Body() loginUserData: LoginUserDto) {
    const token = await this.authService.loginUser(loginUserData);

    return {
      response: token,
    };
  }

  @ApiChangePassword()
  @Post('/changePassword')
  async changePassword(@Body() userData: UpdatePasswordDto) {
    const message = await this.authService.changePassword(userData);

    return {
      message: message,
    };
  }

  @ApiAddAdmin()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('/:id/role')
  async addAdmin(@Param('id') id: string, @Body() body: UpdateRoleDto) {
    return await this.authService.updateRole(id, body);
  }

  @ApiListUsers()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async listUsers() {
    return await this.authService.listUsers();
  }
}
