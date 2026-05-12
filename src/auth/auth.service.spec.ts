import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserEntity } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('must throw ConflictException if email already exist', async () => {
    jest
      .spyOn(authService['userRepository'], 'findOne')
      .mockResolvedValue({ id: '1', email: 'test@test.com' } as UserEntity);

    await expect(
      authService.registerUser({
        name: 'Nicolas',
        email: 'test@test.com',
        password: '123456',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it("must throw NotFoundException if email is don't exist", async () => {
    jest
      .spyOn(authService['userRepository'], 'findOne')
      .mockResolvedValue(null);

    await expect(
      authService.loginUser({
        email: 'wrongEmail@test.com',
        password: '123456',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('must throw UnauthorizedException if password is wrong', async () => {
    jest
      .spyOn(authService['userRepository'], 'findOne')
      .mockResolvedValue({ id: '1', password: '123456' } as UserEntity);

    await expect(
      authService.loginUser({
        email: 'test@test.com',
        password: 'wrongPassword',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('must return user', async () => {
    jest
      .spyOn(authService['userRepository'], 'findOne')
      .mockResolvedValue(null);

    jest.spyOn(authService['userRepository'], 'save').mockResolvedValue({
      id: '1',
      name: 'Nícolas',
      email: 'test@test.com',
      password: 'hashedPassword',
    } as UserEntity);

    await expect(
      authService.registerUser({
        name: 'Nícolas',
        email: 'test@test.com',
        password: '123456',
      }),
    ).resolves.toMatchObject({ name: 'Nícolas', email: 'test@test.com' });
  });

  it('must return accessToken', async () => {
    jest.spyOn(authService['userRepository'], 'findOne').mockResolvedValue({
      id: '1',
      name: 'Nícolas',
      email: 'test@test.com',
      password: 'hashedPassword',
    } as UserEntity);

    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

    jest.spyOn(authService['jwtService'], 'sign').mockReturnValue('fake-token');

    await expect(
      authService.loginUser({ email: 'test@test.com', password: '123456' }),
    ).resolves.toMatchObject({ accessToken: 'fake-token' });
  });
});
