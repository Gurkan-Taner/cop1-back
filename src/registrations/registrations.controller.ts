import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RegistrationsService } from './registrations.service';

@UseGuards(JwtAuthGuard)
@Controller('/api/missions/:missionId/slots/:slotId/inscriptions')
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @Get('/')
  async getInscriptions(@Param('slotId') slotId: string) {
    return await this.registrationsService.getUsersBySlot(slotId);
  }

  @Post('/')
  async suscribe(
    @Param('slotId') slotId: string,
    @Req() req: { user: { sub: string } },
  ) {
    return await this.registrationsService.subscribe(slotId, req.user.sub);
  }

  @Delete('/')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unsubscribe(
    @Param('slotId') slotId: string,
    @Req() req: { user: { sub: string } },
  ) {
    return await this.registrationsService.unsubscribe(slotId, req.user.sub);
  }
}
