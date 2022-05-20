import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap()
{
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()) 

  const config = new DocumentBuilder()
    .setTitle('API example')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('api')
    .build();

  //COOKIE PARSER POUR JWT se renseigner !!!! bc important!!!
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, doc);

  app.enableCors({
    credentials:true,
    origin:true
  }) // pour connecter le back et le front !!!

  await app.listen(8090); //TODO env variable
}

bootstrap();