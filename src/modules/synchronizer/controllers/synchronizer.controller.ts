import { Controller } from '@nestjs/common';
import { MovementDto } from '../dtos/movement.dto';
import { BalanceDto } from '../dtos/balance.dto';

@Controller()
export class SynchronizerController {
  constructor() {}

  checkOperations(movements: Array<MovementDto>, balances: Array<BalanceDto>) {
    movements.sort((a, b) => a.date.getTime() - b.date.getTime());
    balances.sort((a, b) => a.date.getTime() - b.date.getTime());
  }
}
