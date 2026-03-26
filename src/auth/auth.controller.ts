import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginPayload: LoginDto) {
    return this.authService.login(loginPayload);
  }

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerPayload: RegisterDto) {
    return this.authService.register(registerPayload);
  }
}
