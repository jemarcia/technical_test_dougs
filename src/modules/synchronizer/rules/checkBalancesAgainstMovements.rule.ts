import { BalanceDto } from '../dtos/balance.dto';
import { MovementDto } from '../dtos/movement.dto';
import { FindMovementsWithSameField } from '../helpers/findMovementsWithSameField.helper';
import { FindStrictlyEqualMovements } from '../helpers/findStrictlyEqualMovements.helper';
import { Reason } from '../interfaces/validation.interface';

export class CheckBalancesAgainstMovementsRule {
  static execute(
    movements: Array<MovementDto>,
    balances: Array<BalanceDto>
  ): Array<Reason> {
    const reasons = [];
    let lastCheckedMovementIndex = 0;

    for (let i = 0; i < balances.length - 1; i++) {
      let currentBalance = balances[i].balance;
      const periodMovements = [];

      for (let j = lastCheckedMovementIndex; j < movements.length; j++) {
        const movement = movements[j];

        if (movement.date.getTime() < balances[i + 1].date.getTime()) {
          currentBalance += movement.amount;
          periodMovements.push(movement);
          lastCheckedMovementIndex = j + 1;
        } else {
          break;
        }
      }

      if (currentBalance !== balances[i + 1].balance) {
        const imbalanceReason = {
          reason: 'Déséquilibre entre mouvements et balance',
          balanceDate: balances[i + 1].date,
          expectedBalance: balances[i + 1].balance,
          actualBalance: currentBalance,
          invalidMovements: periodMovements,
          potentialCauses: []
        };

        const strictlyEqualMovements =
          FindStrictlyEqualMovements.execute(periodMovements);
        if (strictlyEqualMovements.length) {
          imbalanceReason.potentialCauses.push({
            potentialCause: 'Ces opérations sont strictement égales',
            invalidMovements: strictlyEqualMovements
          });
        }

        const sameIDMovements = FindMovementsWithSameField.execute(
          periodMovements,
          'id'
        );
        if (sameIDMovements.length) {
          imbalanceReason.potentialCauses.push({
            potentialCause: 'Ces opérations ont le même identifiant',
            invalidMovements: sameIDMovements
          });
        }

        const sameDates = FindMovementsWithSameField.execute(
          periodMovements,
          'date'
        );
        if (sameDates.length) {
          imbalanceReason.potentialCauses.push({
            potentialCause: 'Ces opérations ont la même date',
            invalidMovements: sameDates
          });
        }

        const sameAmounts = FindMovementsWithSameField.execute(
          periodMovements,
          'amount'
        );
        if (sameAmounts.length) {
          imbalanceReason.potentialCauses.push({
            potentialCause: 'Ces opérations ont le même montant',
            invalidMovements: sameAmounts
          });
        }

        reasons.push(imbalanceReason);
      }
    }

    return reasons.length > 0 ? reasons : [];
  }
}
