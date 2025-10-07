import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KeuzeModuleAppKeuzeModuleAppController } from './presentation/controllers/KeuzeModuleAppKeuzeModuleAppController';
import { KeuzeModuleAppService } from './application/services/KeuzeModuleAppService';

@Module({
  imports: [],
  controllers: [AppController, KeuzeModuleAppKeuzeModuleAppController],
  providers: [AppService, KeuzeModuleAppService],
})
export class AppModule {}
