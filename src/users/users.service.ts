import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/db/prisma.service';
import { Prisma } from 'generated/prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

const PUBLIC_USER_FIELDS = {
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  number: true,
  id: true,
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: PUBLIC_USER_FIELDS,
    });
  }

  async findOneById(userId: string) {
    return await this.findOneByIdOrFail(userId);
  }

  async findOne(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async update(userId: string, user: UpdateUserDto) {
    await this.findOneByIdOrFail(userId);

    if (user.email) {
      const emailTaken = await this.prisma.user.findFirst({
        where: { email: user.email, NOT: { id: userId } },
      });
      if (emailTaken) throw new ConflictException('Email already in use');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        number: user.number,
      },
      select: PUBLIC_USER_FIELDS,
    });
  }

  async delete(userId: string) {
    await this.findOneByIdOrFail(userId);

    await this.prisma.user.delete({
      where: { id: userId },
    });
  }

  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data,
    });
  }

  private async findOneByIdOrFail(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: PUBLIC_USER_FIELDS,
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
