import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import cookieParser from 'cookie-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';


const req = require('cors')

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule , {cors : true});
  const config = new DocumentBuilder().setTitle('Demp application')
  
  .setDescription('Demo application')
  .setVersion('V1')
  .addTag('books')
  .build()

  app.enableCors({
    origin : '*',
    credentials : true
  })

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
  
  app.useStaticAssets(join(__dirname, '..', 'static'));
  await app.listen(3000);
}
bootstrap();
