import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as passport from 'passport'
import * as cookieParser from 'cookie-parser';

import { ValidationPipe } from '@nestjs/common';

async function bootstrap()
{
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT;

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe()) 

  const config = new DocumentBuilder()
    .setTitle('API example')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('api')
    .build();

  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, doc);

  //app.use(passport.initialize());

  app.enableCors({
    credentials:true,
    origin:true
  }); // pour connecter le back et le front !!!


  await app.listen(PORT, () => console.log(`Running on Port : ${PORT}`));
}

bootstrap();