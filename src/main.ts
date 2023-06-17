import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ScheduleModule } from '@nestjs/schedule';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
        }),
    );

    app.enableCors();
    app.useWebSocketAdapter(new IoAdapter(app));
    // app.useWebSocketAdapter(new MyGateWay(app));
    await app.listen(3333, '0.0.0.0');
}

bootstrap();

ScheduleModule.forRoot();
