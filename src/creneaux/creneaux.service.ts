import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class CreneauxService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.creneau.findMany();
  }

  async create(data: Prisma.CreneauCreateInput) {
    return this.prisma.creneau.create({
      data,
    });
  }

  async get(creneauId: string) {
    return await this.findOneByIdOrFail(creneauId);
  }

  private async findOneByIdOrFail(creneauId: string) {
    const mission = await this.prisma.mission.findUnique({
      where: { id: creneauId },
    });
    if (!mission) throw new NotFoundException('Creneau not found');
    return mission;
  }
}
