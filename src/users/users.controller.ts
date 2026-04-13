import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import type { UpdateUserDto } from './dto/update-user.dto';
import type { ResetPasswordDto } from './dto/reset-password.dto';

import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enum/role.enum';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { JwtPayload } from 'src/auth/types';
import type { RegisterDto } from 'src/auth/dto/register.dto';

@UseGuards(RolesGuard)
@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  @Roles(Role.Admin)
  async getUsersList() {
    return await this.usersService.findAll();
  }

  @Post('/')
  @Roles(Role.Admin)
  async createUser(@Body() createUserDto: RegisterDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get('/me')
  async getMe(@Req() req: { user: JwtPayload }) {
    return await this.usersService.findOneById(req.user['sub']);
  }

  @Get('/:id')
  async getUser(@Param('id') id: string) {
    return await this.usersService.findOneById(id);
  }

  @Post('/reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Req() req: { user: JwtPayload },
  ) {
    return await this.usersService.resetPassword(
      req.user['sub'],
      resetPasswordDto,
    );
  }

  @Put('/')
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: { user: JwtPayload },
  ) {
    return await this.usersService.update(req.user['sub'], updateUserDto);
  }

  @Put('/:id')
  @Roles(Role.Admin)
  async updateUserWithId(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id') id: string,
  ) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete('/')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Req() req: { user: JwtPayload }) {
    return await this.usersService.delete(req.user['sub']);
  }
}
