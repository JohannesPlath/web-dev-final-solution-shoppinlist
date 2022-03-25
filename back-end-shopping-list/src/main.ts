import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const origin = 'http://localhost:4200';
  app.enableCors({ credentials: true, origin: origin });
  await app.listen(3000);
}

bootstrap();
