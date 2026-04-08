import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';

import { PasswordResetService } from './password-reset.service';

import type { ForgotPasswordDto } from './dto/forgot-password.dto';
import type { ResetPasswordDto } from './dto/reset-password.dto';
import { Public } from '../decorators/public.decorator';

@Controller('auth/password')
export class PasswordResetController {
  constructor(private readonly passwordResetService: PasswordResetService) {}

  @Public()
  @Post('forgot')
  @HttpCode(HttpStatus.NO_CONTENT)
  async forgot(@Body() dto: ForgotPasswordDto): Promise<void> {
    await this.passwordResetService.requestReset(dto.email);
  }

  @Public()
  @Get('reset/:token')
  async verify(@Param('token') token: string) {
    const valid = await this.passwordResetService.verifyToken(token);
    if (!valid) throw new BadRequestException('Invalid or expired token');
    return { valid: true };
  }

  @Public()
  @Post('reset')
  @HttpCode(HttpStatus.NO_CONTENT)
  async reset(@Body() dto: ResetPasswordDto): Promise<void> {
    await this.passwordResetService.resetPassword(dto);
  }
}
