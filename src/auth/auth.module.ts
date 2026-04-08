import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from 'src/users/users.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { PasswordResetController } from './password-reset/password-reset.controller';
import { PasswordResetService } from './password-reset/password-reset.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow<number>('JWT_ACCESS_EXPIRES_IN'),
        },
      }),
    }),
  ],
  controllers: [AuthController, PasswordResetController],
  providers: [AuthService, UsersService, JwtStrategy, PasswordResetService],
  exports: [AuthService],
})
export class AuthModule {}
