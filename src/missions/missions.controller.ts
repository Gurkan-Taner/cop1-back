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
  UseGuards,
} from '@nestjs/common';
import { MissionsService } from './missions.service';

import type { CreateMissionDto } from './dto/create-mission.dto';
import type { UpdateMissionDto } from './dto/update-mission.dto';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enum/role.enum';

@UseGuards(RolesGuard)
@Controller('/api/missions')
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  @Get('/')
  async getMissionsList() {
    return await this.missionsService.getAll();
  }

  @Get('/:id')
  async getMission(@Param('id') id: string) {
    return await this.missionsService.get(id);
  }

  @Post('/')
  @Roles(Role.Admin)
  async createMission(@Body() createMissionDto: CreateMissionDto) {
    return await this.missionsService.create(createMissionDto);
  }

  @Put('/:id')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  async updateMission(
    @Body() updateMissionDto: UpdateMissionDto,
    @Param('id') id: string,
  ) {
    return await this.missionsService.update(id, updateMissionDto);
  }

  @Delete('/:id')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMission(@Param('id') id: string) {
    return await this.missionsService.delete(id);
  }
}
