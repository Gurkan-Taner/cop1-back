import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { AuthService } from './auth.service';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 60 * 60,
} as const;

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginPayload: LoginDto,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    const { token, user } = await this.authService.login(loginPayload);
    response.setCookie('access_token', token.access_token, COOKIE_OPTIONS);

    return { message: 'Logged in successfully', data: user };
  }

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerPayload: RegisterDto,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    const { token, user } = await this.authService.register(registerPayload);

    response.setCookie('access_token', token.access_token, COOKIE_OPTIONS);

    return { message: 'Registered successfully', data: user };
  }

  @Post('/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Res({ passthrough: true }) response: FastifyReply) {
    response.setCookie('access_token', '', { ...COOKIE_OPTIONS, maxAge: 0 });
  }
}
