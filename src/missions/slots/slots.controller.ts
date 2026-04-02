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

import { SlotsService } from './slots.service';
import type { CreateSlotDto } from './dto/create-slot.dto';
import type { UpdateSlotDto } from './dto/update-slot.dto';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enum/role.enum';

@UseGuards(RolesGuard)
@Controller('/api/missions/:missionId/slots')
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Get('/')
  async getSlotsList(@Param('missionId') missionId: string) {
    return await this.slotsService.getAllByMission(missionId);
  }

  @Get('/:id')
  async getSlot(
    @Param('missionId') missionId: string,
    @Param('id') id: string,
  ) {
    return await this.slotsService.get(missionId, id);
  }

  @Post('/')
  @Roles(Role.Admin)
  async createSlot(
    @Param('missionId') missionId: string,
    @Body() createSlotDto: CreateSlotDto,
  ) {
    return await this.slotsService.create(missionId, createSlotDto);
  }

  @Put('/:id')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  async updateSlot(
    @Param('missionId') missionId: string,
    @Param('id') id: string,
    @Body() updateSlotDto: UpdateSlotDto,
  ) {
    return await this.slotsService.update(missionId, id, updateSlotDto);
  }

  @Delete('/:id')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSlot(
    @Param('missionId') missionId: string,
    @Param('id') id: string,
  ) {
    return await this.slotsService.delete(missionId, id);
  }
}
