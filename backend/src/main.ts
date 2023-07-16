import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as csurf from 'csurf';
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

    app.use(csurf())
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document)

    console.log(__dirname)
    app.useStaticAssets(join(__dirname, 'Chat', 'static'));
    app.setBaseViewsDir(join(__dirname, 'Chat', 'views'));
    app.setViewEngine('ejs');
    await app.listen(3000);
}
bootstrap();
