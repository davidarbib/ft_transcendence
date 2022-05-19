import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as session from 'express-session'
import * as passport from 'passport'


async function bootstrap()
{
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT;

  const config = new DocumentBuilder()
    .setTitle('API example')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('api')
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, doc);

  app.use(
    session({
      cookie: {
        maxAge: 86400000, //1 day
      },
      secret: process.env.COOKIE_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(PORT, () => console.log(`Running on Port : ${PORT}`));
}

bootstrap();