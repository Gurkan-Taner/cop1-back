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
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { SlotsService } from './slots.service';
import type { CreateSlotDto } from './dto/create-slot.dto';
import type { UpdateSlotDto } from './dto/update-slot.dto';

@UseGuards(JwtAuthGuard)
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
  async createSlot(
    @Param('missionId') missionId: string,
    @Body() createSlotDto: CreateSlotDto,
  ) {
    return await this.slotsService.create(missionId, createSlotDto);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updateSlot(
    @Param('missionId') missionId: string,
    @Param('id') id: string,
    @Body() updateSlotDto: UpdateSlotDto,
  ) {
    return await this.slotsService.update(missionId, id, updateSlotDto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCreneau(
    @Param('missionId') missionId: string,
    @Param('id') id: string,
  ) {
    return await this.slotsService.delete(missionId, id);
  }
}
