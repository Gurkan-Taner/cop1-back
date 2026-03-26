import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { PUBLIC_USER_FIELDS } from 'src/users/users.service';

@Injectable()
export class RegistrationsService {
  constructor(private readonly prisma: PrismaService) {}

  private async findOneByIdOrFail(slotId: string) {
    const slot = await this.prisma.slot.findUnique({
      where: { id: slotId },
    });
    if (!slot) throw new NotFoundException('Slot not found');
    return slot;
  }

  async getUsersBySlot(slotId: string) {
    await this.findOneByIdOrFail(slotId);
    return this.prisma.user.findMany({
      where: {
        inscriptions: {
          some: { slotId },
        },
      },
      select: PUBLIC_USER_FIELDS,
    });
  }

  async subscribe(slotId: string, userId: string) {
    return this.prisma.$transaction(
      async (tx) => {
        const slot = await tx.slot.findUnique({
          where: { id: slotId },
        });

        if (!slot) throw new NotFoundException('Slot not found');

        const inscriptionsCount = await tx.inscription.count({
          where: { slotId },
        });
        if (inscriptionsCount >= slot.placeAvailable) {
          throw new BadRequestException(
            'No more places available in this slot',
          );
        }

        const exist = await tx.inscription.findUnique({
          where: { userId_slotId: { userId, slotId } },
        });
        if (exist) throw new BadRequestException('Already in slot');

        return tx.inscription.create({
          data: { userId, slotId },
        });
      },
      {
        isolationLevel: 'Serializable',
      },
    );
  }

  async unsubscribe(slotId: string, userId: string) {
    await this.findOneByIdOrFail(slotId);

    const inscription = await this.prisma.inscription.findUnique({
      where: { userId_slotId: { userId, slotId } },
    });
    if (!inscription) {
      throw new NotFoundException('You are not subscribed in this slot');
    }

    return this.prisma.inscription.delete({
      where: { userId_slotId: { userId, slotId } },
    });
  }
}
