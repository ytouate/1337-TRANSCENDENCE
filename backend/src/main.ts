import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const config = new DocumentBuilder()
    .setTitle('Demp application')

    .setDescription('Demo application')
    .setVersion('V1')
    .addTag('books')
    .build();

    app.enableCors({
      origin : '*',
      credentials : true
    })
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document)

    app.useStaticAssets(join(__dirname, 'Chat', 'static'));
    app.setBaseViewsDir(join(__dirname, 'Chat', 'views'));
    app.setViewEngine('ejs');
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3000);
}
bootstrap();
