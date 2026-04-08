import { BadRequestException, Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { createHash, randomBytes } from 'crypto';

import { PrismaService } from 'src/db/prisma.service';
import { UsersService } from 'src/users/users.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class PasswordResetService {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async requestReset(email: string): Promise<void> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) return;

    await this.prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    const rawToken = randomBytes(32).toString('hex');
    const hashedToken = this.hash(rawToken);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: hashedToken,
        expiresAt,
      },
    });

    const resetUrl = `https://cop1.gurkan-taner.fr/reset-password/${rawToken}`;

    void this.mailService.sendPasswordReset(user.email, resetUrl);
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    if (dto.password !== dto.passwordConfirm) {
      throw new BadRequestException("Password doesn't match");
    }
    const hashedToken = this.hash(dto.token);

    const record = await this.prisma.passwordResetToken.findUnique({
      where: { token: hashedToken },
    });

    if (!record) throw new BadRequestException('Token invalid');
    if (record.expiresAt < new Date()) {
      await this.prisma.passwordResetToken.delete({ where: { id: record.id } });
      throw new BadRequestException('Token expired');
    }

    const hashed = await hash(dto.password, 12);
    await this.usersService.updatePassword(record.userId, hashed);

    await this.prisma.passwordResetToken.delete({ where: { id: record.id } });
  }

  async verifyToken(rawToken: string): Promise<boolean> {
    const hashedToken = this.hash(rawToken);

    const record = await this.prisma.passwordResetToken.findUnique({
      where: { token: hashedToken },
    });

    if (!record) return false;

    if (record.expiresAt < new Date()) {
      await this.prisma.passwordResetToken.delete({ where: { id: record.id } });
      return false;
    }

    return true;
  }

  private hash(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
