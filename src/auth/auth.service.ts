import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { JwtPayload } from './types';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private saltOrRounds: number = 10;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginPayload: LoginDto) {
    const user = await this.usersService.findOne(loginPayload.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await compare(loginPayload.password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        number: user.number,
        id: user.id,
      },
      token: this.createTokens({
        sub: user.id,
        email: user.email,
        role: user.role,
      }),
    };
  }

  async register(registerPayload: RegisterDto) {
    const existingUser = await this.usersService.findOne(registerPayload.email);

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await hash(
      registerPayload.password,
      this.saltOrRounds,
    );

    const user = await this.usersService.create({
      ...registerPayload,
      password: hashedPassword,
      role: 'user',
    });

    return {
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        number: user.number,
        id: user.id,
      },
      token: this.createTokens({
        sub: user.id,
        email: user.email,
        role: user.role,
      }),
    };
  }

  createTokens(payload: JwtPayload) {
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
