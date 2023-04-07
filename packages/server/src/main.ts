import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });
  console.log(join(__dirname, '../../', 'build'));
  await app.listen(process.env.PORT || 5000);
}
bootstrap();
