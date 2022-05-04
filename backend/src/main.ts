import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
 import { Put_Data } from './put-data-db/data'

async function bootstrap()
{
  const app = await NestFactory.create(AppModule);

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
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, doc);
  
  await Put_Data();
  await app.listen(8090); //TODO env variable
}

bootstrap();