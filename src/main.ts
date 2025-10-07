import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 3000; // fixed port per user request
  await app.listen(port);
  console.log(`Application listening on port ${port}`);
}
bootstrap();
