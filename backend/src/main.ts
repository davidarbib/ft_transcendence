import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap()
{
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()) 
  /*
  let allowlist = ['http://localhost:8080'];
  let corsOptionsDelegate = function (req, callback) {
  let corsOptions;

  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
    console.log("cors allowed");
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
*/


  const config = new DocumentBuilder()
    .setTitle('API example')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('api')
    .build();
  //COOKIE PARSER POUR JWT se renseigner !!!! bc important!!!
  const doc = SwaggerModule.createDocument(app, config);
  app.enableCors({
    credentials:true,
    origin:true
  }) // pour connecter le back et le front !!!
  SwaggerModule.setup('/', app, doc);

  await app.listen(8090); //TODO env variable
}

bootstrap();