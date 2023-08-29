import { Module } from '@nestjs/common';
import { SynchronizerController } from './modules/synchronizer/controllers/synchronizer.controller';
import { SynchronizerModule } from './modules/synchronizer/synchronizer.module';

@Module({
  imports: [SynchronizerModule],
  controllers: [SynchronizerController],
  providers: []
})
export class AppModule {}
