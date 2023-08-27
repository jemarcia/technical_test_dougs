import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SynchronizerController } from './modules/synchronizer/controllers/synchronizer.controller';

@Module({
  imports: [],
  controllers: [AppController, SynchronizerController],
  providers: [AppService]
})
export class AppModule {}