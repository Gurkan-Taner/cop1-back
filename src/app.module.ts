import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './db/prisma.module';
import { MissionsModule } from './missions/missions.module';
import { CreneauxModule } from './creneaux/creneaux.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    PrismaModule,
    MissionsModule,
    CreneauxModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
