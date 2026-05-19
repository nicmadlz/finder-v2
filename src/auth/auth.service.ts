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
import { MailService } from './mail.service';
import crypto from 'crypto';
import { UpdatePasswordDto } from './dto/UpdatePassword.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  private async findUserByEmail(email: string) {
    return await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  async registerUser(userData: CreateUserDto) {
    const userCount = await this.userRepository.count();
    const role = userCount === 0 ? 'admin' : 'user';

    const exist = await this.findUserByEmail(userData.email);
    if (exist) {
      throw new ConflictException('This email is already in use!');
    }

    const randomPassword = crypto.randomBytes(8).toString('hex');
    const hashRandomPassword = await bcrypt.hash(randomPassword, 10);

    const user = Object.assign(new UserEntity(), {
      name: userData.name,
      email: userData.email,
      password: hashRandomPassword,
      role: role,
    });

    try {
      const createdUser = await this.userRepository.save(user);
      user.password = randomPassword;
      await this.mailService.sendPasswordEmail(user);

      return createdUser;
    } catch (error) {
      console.log(error);
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

    if (!exist.need_to_change_password) {
      const payload = { sub: exist.id, email: exist.email, role: exist.role };
      return this.jwtService.sign(payload);
    }

    return `You need to change your password to login!`;
  }

  async changePassword(userData: UpdatePasswordDto) {
    const exist = await this.findUserByEmail(userData.email);
    if (!exist) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordCompare = await bcrypt.compare(
      userData.generatedPassword,
      exist.password,
    );
    if (!passwordCompare) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const cryptoPassword = await bcrypt.hash(userData.newPassword, 10);
    try {
      await this.userRepository.update(exist.id, {
        password: cryptoPassword,
        need_to_change_password: false,
      });
      return 'You changed your password!';
    } catch {
      throw new InternalServerErrorException('Error to change your password');
    }
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
