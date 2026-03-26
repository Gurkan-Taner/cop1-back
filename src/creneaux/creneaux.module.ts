import { Module } from '@nestjs/common';
import { CreneauxService } from './creneaux.service';
import { CreneauxController } from './creneaux.controller';

@Module({
  controllers: [CreneauxController],
  providers: [CreneauxService],
})
export class CreneauxModule {}
