import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule , {cors : true});
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
  await app.listen(3000);
}
bootstrap();
