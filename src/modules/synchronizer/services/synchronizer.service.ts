import { Injectable } from '@nestjs/common';
import { MovementDto } from '../dtos/movement.dto';
import { BalanceDto } from '../dtos/balance.dto';

@Injectable()
export class SynchronizerService {
  checkOperations(movements: Array<MovementDto>, balances: Array<BalanceDto>) {
    movements.sort((a, b) => a.date.getTime() - b.date.getTime());
    balances.sort((a, b) => a.date.getTime() - b.date.getTime());

    const firstDateBalances = balances[0].date;
    const operationsBeforeFirstBalance = movements.filter(
      (mv) => mv.date.getTime() < firstDateBalances.getTime()
    );

    if (operationsBeforeFirstBalance.length > 0) {
      anomalies.push({
        message:
          'Certaines opérations ne peuvent pas être vérifiées car leur date est antérieure au plus ancien point de contrôle',
        invalidOperations: operationsBeforeFirstBalance
      });
      return { message: 'I’m a teapot', reasons: anomalies };
    }
  }
}
