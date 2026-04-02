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
import type { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enum/role.enum';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { JwtPayload } from 'src/auth/types';

@UseGuards(RolesGuard)
@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  @Roles(Role.Admin)
  async getUsersList() {
    return await this.usersService.findAll();
  }

  @Get('/me')
  async getMe(@Req() req: { user: JwtPayload }) {
    return await this.usersService.findOneById(req.user['sub']);
  }

  @Get('/:id')
  async getUser(@Param('id') id: string) {
    return await this.usersService.findOneById(id);
  }

  @Put('/')
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: { user: JwtPayload },
  ) {
    return await this.usersService.update(req.user['sub'], updateUserDto);
  }

  @Delete('/')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Req() req: { user: JwtPayload }) {
    return await this.usersService.delete(req.user['sub']);
  }
}
