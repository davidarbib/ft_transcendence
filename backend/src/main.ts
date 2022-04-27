import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { DataSource } from 'typeorm';

async function bootstrap()
{
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API example')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('api')
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, doc);

  await app.listen(8090); //TODO env variable
}


bootstrap();
