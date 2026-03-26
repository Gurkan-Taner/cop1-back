import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
  async getUsersList() {
    return await this.usersService.findAll();
  }

  @Get('/me')
  async getMe(@Req() req) {
    return await this.usersService.findOneById(req.user['sub']);
  }

  @Get('/:id')
  async getUser(@Param('id') id: string) {
    return await this.usersService.findOneById(id);
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
