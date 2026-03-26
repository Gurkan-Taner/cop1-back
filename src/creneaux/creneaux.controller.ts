import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CreneauxService } from './creneaux.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('/api/missions')
export class CreneauxController {
  constructor(private readonly creneauxService: CreneauxService) {}

  // @Get('/')
  // async getCreneauList() {
  //   return await this.creneauxService.getAll();
  // }

  // @Get('/')
  // async getCreneau(@Param('id') id: string) {
  //   return await this.creneauxService.get(id);
  // }
}
