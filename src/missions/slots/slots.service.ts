import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/db/prisma.service';
import type { CreateSlotDto } from './dto/create-slot.dto';
import type { UpdateSlotDto } from './dto/update-slot.dto';

@Injectable()
export class SlotsService {
  constructor(private readonly prisma: PrismaService) {}

  private async findOneByIdOrFail(missionId: string) {
    const mission = await this.prisma.mission.findUnique({
      where: { id: missionId },
    });
    if (!mission) throw new NotFoundException('Mission not found');
    return mission;
  }

  async getAllByMission(missionId: string) {
    await this.findOneByIdOrFail(missionId);
    return this.prisma.slot.findMany({
      where: { missionId },
    });
  }

  async get(missionId: string, id: string) {
    await this.findOneByIdOrFail(missionId);
    const creneau = await this.prisma.slot.findFirst({
      where: { id, missionId },
    });
    if (!creneau) throw new NotFoundException('Slot not found');
    return creneau;
  }

  async create(missionId: string, data: CreateSlotDto) {
    await this.findOneByIdOrFail(missionId);
    return this.prisma.slot.create({
      data: { ...data, missionId },
    });
  }

  async update(missionId: string, id: string, data: UpdateSlotDto) {
    await this.get(missionId, id);
    return this.prisma.slot.update({
      where: { id },
      data: { ...data, missionId },
    });
  }

  async delete(missionId: string, id: string) {
    await this.get(missionId, id);
    return this.prisma.slot.delete({ where: { id } });
  }
}
