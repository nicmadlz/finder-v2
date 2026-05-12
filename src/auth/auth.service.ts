import bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUser.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/LoginUser.dto';
import { UpdateRoleDto } from './dto/UpdateRole.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  private async findUserByEmail(email: string) {
    return await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  async registerUser(userData: CreateUserDto) {
    const exist = await this.findUserByEmail(userData.email);
    if (exist) {
      throw new ConflictException('This email is already in use!');
    }

    const cryptoPassword = await bcrypt.hash(userData.password, 10);

    const user = Object.assign(new UserEntity(), {
      name: userData.name,
      email: userData.email,
      password: cryptoPassword,
    });

    try {
      return await this.userRepository.save(user);
    } catch {
      throw new InternalServerErrorException('Failed to register user');
    }
  }

  async loginUser(userData: LoginUserDto) {
    const exist = await this.findUserByEmail(userData.email);
    if (!exist) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordCompare = await bcrypt.compare(
      userData.password,
      exist.password,
    );
    if (!passwordCompare) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: exist.id, email: exist.email, role: exist.role };
    return this.jwtService.sign(payload);
  }

  async updateRole(id: string, updatedRole: UpdateRoleDto) {
    const userExist = await this.userRepository.findOne({
      where: { id },
    });

    if (!userExist) {
      throw new NotFoundException('User not found');
    }

    userExist.role = updatedRole.role;

    try {
      return this.userRepository.save(userExist);
    } catch {
      throw new InternalServerErrorException('Failed to update user role');
    }
  }

  async listUsers() {
    try {
      return this.userRepository.find({
        select: ['id', 'name', 'role'],
      });
    } catch {
      throw new InternalServerErrorException('Failed to list users');
    }
  }
}
