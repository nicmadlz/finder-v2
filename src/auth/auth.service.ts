import bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { UserEntity } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto } from "./dto/CreateUser.dto";
import { JwtService } from "@nestjs/jwt";
import { LoginUserDto } from "./dto/LoginUser.dto";
import { Role } from "./enums/role.enum";
import { UpdateRoleDto } from "./dto/UpdateRole.dto";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService) { }

    private async findUserByEmail(email: string) {
        return await this.userRepository.findOne({
            where: {
                email: email
            }
        })
    }


    async registerUser(userData: CreateUserDto) {
        const exist = await this.findUserByEmail(userData.email);
        if (exist) {
            throw new ConflictException("This email is already in use!")
        }

        const cryptoPassword = await bcrypt.hash(userData.password, 10);


        const user = Object.assign(new UserEntity(), {
            name: userData.name,
            email: userData.email,
            password: cryptoPassword
        })

        return await this.userRepository.save(user);
    }

    async loginUser(userData: LoginUserDto) {
        const exist = await this.findUserByEmail(userData.email);
        if (!exist) {
            throw new NotFoundException("User not found");
        }

        const passwordCompare = await bcrypt.compare(userData.password, exist.password)
        if (!passwordCompare) {
            throw new UnauthorizedException("Invalid password");
        }

        const payload = { sub: exist.id, email: exist.email, role: exist.role };
        const token = this.jwtService.sign(payload);
        return { accessToken: token };
    }

    async updateRole(id: string, updatedRole: UpdateRoleDto) {
        const userExist = await this.userRepository.findOne({
            where: {
                id: id
            }
        });

        if (!userExist) {
            throw new NotFoundException("User not found");
        }

        return this.userRepository.update(id, updatedRole );
    }

    async listUsers() {
        return this.userRepository.find({
            select: ['id', 'name', 'email', 'role']
        });
    }
}