import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import type { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(JwtAuthGuard)
@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  async getUsers() {
    return await this.usersService.findAll();
  }

  @Put('/')
  async updateUser(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    return await this.usersService.update(req.user['sub'], updateUserDto);
  }

  @Delete('/')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Req() req) {
    return await this.usersService.delete(req.user['sub']);
  }
}
