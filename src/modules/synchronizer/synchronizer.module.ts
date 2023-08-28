import { Module } from '@nestjs/common';
import { SynchronizerService } from './services/synchronizer.service';

@Module({
  imports: [],
  providers: [SynchronizerService],
  exports: [SynchronizerService]
})
export class SynchronizerModule {}
