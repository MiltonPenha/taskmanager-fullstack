import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const usersService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
  };
  const jwtService = {
    sign: jest.fn(),
  };
  const configService = {
    get: jest.fn(),
  };

  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(usersService as never, jwtService as never, configService as never);
    jwtService.sign.mockReturnValue('jwt-token');
    configService.get.mockReturnValue('1d');
  });

  it('registers a user with a hashed password', async () => {
    usersService.create.mockImplementation(async (data) => {
      expect(data.password).not.toBe('secret123');
      expect(await bcrypt.compare('secret123', data.password)).toBe(true);

      return {
        id: 'user-id',
        name: data.name,
        email: data.email,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    const result = await service.register({
      name: 'Milton',
      email: 'MILTON@email.com',
      password: 'secret123',
    });

    expect(usersService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Milton',
        email: 'milton@email.com',
      }),
    );
    expect(result).toEqual({
      accessToken: 'jwt-token',
      user: {
        id: 'user-id',
        name: 'Milton',
        email: 'milton@email.com',
      },
    });
  });

  it('logs in with valid credentials', async () => {
    const hashedPassword = await bcrypt.hash('secret123', 10);
    usersService.findByEmail.mockResolvedValue({
      id: 'user-id',
      name: 'Milton',
      email: 'milton@email.com',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await service.login({
      email: 'MILTON@email.com',
      password: 'secret123',
    });

    expect(usersService.findByEmail).toHaveBeenCalledWith('milton@email.com');
    expect(result.accessToken).toBe('jwt-token');
  });

  it('rejects invalid credentials', async () => {
    usersService.findByEmail.mockResolvedValue(null);

    await expect(
      service.login({
        email: 'missing@email.com',
        password: 'secret123',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});

