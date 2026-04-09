import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { JwtPayload } from './types';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginPayload: LoginDto) {
    const user = await this.usersService.findByEmailInternal(
      loginPayload.email,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await compare(loginPayload.password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { access_token, refresh_token } = await this.createTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    await this.usersService.updateRefreshToken(user.id, refresh_token);

    return {
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        number: user.number,
        id: user.id,
      },
      tokens: {
        access_token,
        refresh_token,
      },
    };
  }

  async register(registerPayload: RegisterDto) {
    const user = await this.usersService.create(registerPayload);

    const { access_token, refresh_token } = await this.createTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    await this.usersService.updateRefreshToken(user.id, refresh_token);

    return {
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        number: user.number,
        id: user.id,
      },
      tokens: {
        access_token,
        refresh_token,
      },
    };
  }

  async refresh(userId: string, refreshToken: string) {
    const user = await this.usersService.findOneByIdWithRefresh(userId);

    if (!user?.refreshToken) throw new UnauthorizedException('Access denied');

    const tokenValid = await compare(refreshToken, user.refreshToken);
    if (!tokenValid) throw new UnauthorizedException('Access denied');

    const tokens = await this.createTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    await this.usersService.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async createTokens(payload: JwtPayload) {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.getOrThrow<number>(
          'JWT_REFRESH_EXPIRES_IN',
        ),
      }),
    ]);

    return { access_token, refresh_token };
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
  }
}
