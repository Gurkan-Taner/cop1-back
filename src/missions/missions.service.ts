import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class MissionsService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.mission.findMany();
  }

  async create(data: Prisma.MissionCreateInput) {
    return this.prisma.mission.create({
      data,
    });
  }

  async get(missionId: string) {
    return await this.findOneByIdOrFail(missionId);
  }

  async delete(missionId: string) {
    await this.findOneByIdOrFail(missionId);

    await this.prisma.mission.delete({
      where: { id: missionId },
    });
  }

  async update(missionId: string, data: Prisma.MissionUpdateInput) {
    await this.findOneByIdOrFail(missionId);

    return this.prisma.mission.update({
      where: { id: missionId },
      data: data,
    });
  }

  private async findOneByIdOrFail(missionId: string) {
    const mission = await this.prisma.mission.findUnique({
      where: { id: missionId },
    });
    if (!mission) throw new NotFoundException('Mission not found');
    return mission;
  }
}
