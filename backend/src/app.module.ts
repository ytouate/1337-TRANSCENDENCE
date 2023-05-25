import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { authModule } from './AUTH/auth.module';

@Module({
  imports: [authModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
