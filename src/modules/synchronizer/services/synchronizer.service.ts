import { Injectable } from '@nestjs/common';
import { MovementDto } from '../dtos/movement.dto';
import { BalanceDto } from '../dtos/balance.dto';
import { ValidationResult } from '../interfaces/validation.interface';
import { CheckInvalidMovementsBeforeFirstBalanceRule } from '../rules/checkInvalidMovementsBeforeFirstBalance.rule';
import { CheckBalancesAgainstMovementsRule } from '../rules/checkBalancesAgainstMovements.rule';
import { sortByDate } from '../helpers/sorting.helper';

@Injectable()
export class SynchronizerService {
  checkMovements(
    movements: Array<MovementDto>,
    balances: Array<BalanceDto>
  ): ValidationResult {
    movements = sortByDate(movements);
    balances = sortByDate(balances);
    const firstDateBalances = balances[0].date;

    const preFirstBalanceValidation: ValidationResult =
      CheckInvalidMovementsBeforeFirstBalanceRule.execute(
        movements,
        firstDateBalances
      );
    if (preFirstBalanceValidation) {
      return preFirstBalanceValidation;
    }

    const checkBalancesResults = CheckBalancesAgainstMovementsRule.execute(
      movements,
      balances
    );

    if (checkBalancesResults.length > 0) {
      return {
        status: 'Rejected',
        reasons: checkBalancesResults
      };
    } else {
      return {
        status: 'Accepted'
      };
    }
  }
}
