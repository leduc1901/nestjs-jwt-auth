import { NestFactory } from '@nestjs/core';
import cors from 'cors';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  await app.listen(5019);
}
bootstrap();
