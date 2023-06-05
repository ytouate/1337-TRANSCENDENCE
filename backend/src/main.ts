import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import cookieParser from 'cookie-parser';

const req = require('cors')

async function bootstrap() {
  const app = await NestFactory.create(AppModule , {cors : true});
  app.enableCors();

  // app.use(req({origin : 'http://localhost:5173/' , credentials : true} ))

  const config = new DocumentBuilder().setTitle('Demp application')
  
  .setDescription('Demo application')
  .setVersion('V1')
  .addTag('books')
  .build()


  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
  await app.listen(3000);
}
bootstrap();
