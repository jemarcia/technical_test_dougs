import { Body, Controller, Logger, Post } from '@nestjs/common';
import { SynchronizerService } from '../services/synchronizer.service';
import { BodyDataDto } from '../dtos/body.dto';

@Controller()
export class SynchronizerController {
  constructor(private readonly synchronizerService: SynchronizerService) {}

  private readonly logger = new Logger('SynchronizerController');

  @Post('/movements/validation')
  async validateMovements(
    @Body()
    { movements, balances }: BodyDataDto
  ) {
    return this.synchronizerService.checkMovements(movements, balances);
  }
}
