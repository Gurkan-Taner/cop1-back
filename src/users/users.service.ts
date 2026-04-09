import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { Prisma } from 'generated/prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { compare, hash } from 'bcrypt';
import { passwordSalt, tokenSalt } from 'src/global/constants/salt.constants';
import { RegisterDto } from 'src/auth/dto/register.dto';

export const PUBLIC_USER_FIELDS: Prisma.UserSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  number: true,
};

export const AUTH_REFRESH_FIELDS: Prisma.UserSelect = {
  ...PUBLIC_USER_FIELDS,
  refreshToken: true,
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({ select: PUBLIC_USER_FIELDS });
  }

  async findOneById(id: string) {
    return this.getUserOrThrow({ id }, PUBLIC_USER_FIELDS);
  }

  async findOneByEmail(email: string) {
    return this.getUserOrThrow({ email }, PUBLIC_USER_FIELDS);
  }

  async findOneByIdWithRefresh(id: string) {
    return this.getUserOrThrow({ id }, AUTH_REFRESH_FIELDS);
  }

  async findByEmailInternal(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: RegisterDto) {
    const existingUser = await this.findOneByEmail(data.email);

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await hash(data.password, passwordSalt);

    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        role: 'user',
      },
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    const currentUser = await this.getUserOrThrow({ id });

    if (dto.email && dto.email !== currentUser.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (emailExists) throw new ConflictException('Email already in use');
    }

    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: PUBLIC_USER_FIELDS,
    });
  }

  async delete(id: string) {
    await this.getUserOrThrow({ id });
    return this.prisma.user.delete({ where: { id } });
  }

  async updatePassword(userId: string, password: string) {
    const hashed = await hash(password, passwordSalt);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashed,
      },
    });
  }

  async resetPassword(id: string, dto: ResetPasswordDto) {
    const { oldPassword, newPassword, confirmNewPassword } = dto;

    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const user = await this.getUserOrThrow({ id });

    const isMatch = await compare(oldPassword, user.password);
    if (!isMatch) throw new BadRequestException('Invalid old password');

    const hashedNewPassword = await hash(newPassword, passwordSalt);

    return this.prisma.user.update({
      where: { id },
      data: { password: hashedNewPassword },
      select: PUBLIC_USER_FIELDS,
    });
  }

  async updateRefreshToken(id: string, refreshToken: string | null) {
    const hashedToken = refreshToken
      ? await hash(refreshToken, tokenSalt)
      : null;
    return this.prisma.user.update({
      where: { id },
      data: { refreshToken: hashedToken },
    });
  }

  private async getUserOrThrow(
    where: Prisma.UserWhereUniqueInput,
    select?: Prisma.UserSelect,
  ) {
    const user = await this.prisma.user.findUnique({ where, select });
    if (!user) throw new NotFoundException(`User not found`);
    return user;
  }
}
