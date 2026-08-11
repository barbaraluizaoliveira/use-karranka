import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
  
//   app.enableCors();
//   app.useGlobalPipes(new ValidationPipe());

//   const port = process.env.PORT || 3344;
  
//   await app.listen(port);
//   console.log(`🚀 API rodando na porta ${port}`);
// }
// bootstrap();

async function bootstrap() {
  console.log('1');

  const app = await NestFactory.create(AppModule);

  console.log('2');

  app.enableCors();

  console.log('3');

  app.useGlobalPipes(new ValidationPipe());

  console.log('4');

  const port = process.env.PORT || 3344;

  console.log('5');

  await app.listen(port);

  console.log(`🚀 API rodando na porta ${port}`);
}

bootstrap().catch(console.error);