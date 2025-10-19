import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KeuzeModuleAppKeuzeModuleAppController } from './presentation/controllers/KeuzeModuleAppKeuzeModuleAppController';
import { KeuzeModuleAppService } from './application/services/KeuzeModuleAppService';
import { AuthService } from './application/services/AuthService';
import { AuthController } from './presentation/controllers/AuthController';
import { EnrollmentService } from './application/services/EnrollmentService';
import { EnrollmentController } from './presentation/controllers/EnrollmentController';

@Module({
  imports: [],
  controllers: [AppController, KeuzeModuleAppKeuzeModuleAppController, AuthController, EnrollmentController],
  providers: [AppService, KeuzeModuleAppService, AuthService, EnrollmentService],
})
export class AppModule {}
