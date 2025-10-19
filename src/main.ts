import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS so the Vite dev server (http://localhost:5173) can call this API
  // Adjust origins as needed for your environments
  app.enableCors({
    origin: [
      'https://keuzemodule-backend-1.onrender.com/',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: false,
  });

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application listening on http://localhost:${port}`);
}
bootstrap();
