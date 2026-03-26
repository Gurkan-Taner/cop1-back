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

import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import type { CreateMissionDto } from './dto/create-mission.dto';
import type { UpdateMissionDto } from './dto/update-mission.dto';

@UseGuards(JwtAuthGuard)
@Controller('/api/missions')
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  @Get('/')
  async getMissions() {
    return await this.missionsService.getAll();
  }

  @Post('/')
  async createMission(@Body() createMissionDto: CreateMissionDto) {
    return await this.missionsService.create(createMissionDto);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updateMission(
    @Body() updateMissionDto: UpdateMissionDto,
    @Param('id') id: string,
  ) {
    return await this.missionsService.update(id, updateMissionDto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMission(@Param('id') id: string) {
    return await this.missionsService.delete(id);
  }
}
