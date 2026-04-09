import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { AuthService } from './auth.service';

import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';

import { Public } from './decorators/public.decorator';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtPayload, JwtRefreshPayload } from './types';
import {
  ACCESS_COOKIE_OPTIONS,
  REFRESH_COOKIE_OPTIONS,
} from 'src/global/constants/cookies.constants';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginPayload: LoginDto,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    const { tokens, user } = await this.authService.login(loginPayload);
    response.setCookie(
      'access_token',
      tokens.access_token,
      ACCESS_COOKIE_OPTIONS,
    );
    response.setCookie(
      'refresh_token',
      tokens.refresh_token,
      REFRESH_COOKIE_OPTIONS,
    );

    return { message: 'Logged in successfully', data: user };
  }

  @Public()
  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerPayload: RegisterDto,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    const { tokens, user } = await this.authService.register(registerPayload);

    response.setCookie(
      'access_token',
      tokens.access_token,
      ACCESS_COOKIE_OPTIONS,
    );
    response.setCookie(
      'refresh_token',
      tokens.refresh_token,
      REFRESH_COOKIE_OPTIONS,
    );

    return { message: 'Registered successfully', data: user };
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: { user: JwtRefreshPayload },
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    const tokens = await this.authService.refresh(
      req.user['sub'],
      req.user.refreshToken,
    );

    response.setCookie(
      'access_token',
      tokens.access_token,
      ACCESS_COOKIE_OPTIONS,
    );
    response.setCookie(
      'refresh_token',
      tokens.refresh_token,
      REFRESH_COOKIE_OPTIONS,
    );
  }

  @Post('/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Res({ passthrough: true }) response: FastifyReply,
    @Req() req: { user: JwtPayload },
  ) {
    await this.authService.logout(req.user.sub);
    await response.setCookie('access_token', '', {
      ...ACCESS_COOKIE_OPTIONS,
      maxAge: 0,
    });
    await response.setCookie('refresh_token', '', {
      ...REFRESH_COOKIE_OPTIONS,
      maxAge: 0,
    });
  }
}
