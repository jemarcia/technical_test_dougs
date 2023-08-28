import { Injectable } from '@nestjs/common';
import { MovementDto } from '../dtos/movement.dto';
import { BalanceDto } from '../dtos/balance.dto';

@Injectable()
export class SynchronizerService {
  checkMovements(movements: Array<MovementDto>, balances: Array<BalanceDto>) {
    movements.sort((a, b) => a.date.getTime() - b.date.getTime());
    balances.sort((a, b) => a.date.getTime() - b.date.getTime());

    const firstDateBalances = balances[0].date;
    const movementsBeforeFirstBalance = movements.filter(
      (mv) => mv.date.getTime() < firstDateBalances.getTime()
    );

    if (movementsBeforeFirstBalance.length > 0) {
      return {
        reason:
          'Certaines opérations ne peuvent pas être vérifiées car leur date est antérieure au plus ancien point de contrôle, veuillez les retirer pour procéder à la vérification.',
        invalidMovements: movementsBeforeFirstBalance
      };
    }

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

        // Chercher des mouvements strictement égaux
        const strictlyEqualMovements =
          this.findStrictlyEqualMovements(periodMovements);
        if (strictlyEqualMovements.length) {
          imbalanceReason.potentialCauses.push({
            potentialCause: 'Ces opérations sont strictement égales',
            invalidMovements: strictlyEqualMovements
          });
        }

        // Chercher des mouvements ayant le même ID
        const sameIDMovements = this.findMovementsWithSameField(
          periodMovements,
          'id'
        );
        if (sameIDMovements.length) {
          imbalanceReason.potentialCauses.push({
            potentialCause: 'Ces opérations ont le même identifiant',
            invalidMovements: sameIDMovements
          });
        }

        const sameDates = this.findMovementsWithSameField(
          periodMovements,
          'date'
        );
        if (sameDates.length) {
          imbalanceReason.potentialCauses.push({
            potentialCause: 'Ces opérations ont la même date',
            invalidMovements: sameDates
          });
        }

        const sameAmounts = this.findMovementsWithSameField(
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

    if (reasons.length === 0) {
      return 'Accepted';
    } else {
      return reasons;
    }
  }

  findStrictlyEqualMovements(
    movements: Array<MovementDto>
  ): Array<Array<MovementDto>> {
    const results = [];
    const alreadySeen = new Set();

    for (let i = 0; i < movements.length; i++) {
      if (alreadySeen.has(i)) {
        continue;
      }
      const duplicates = [movements[i]];
      for (let j = i + 1; j < movements.length; j++) {
        if (JSON.stringify(movements[i]) === JSON.stringify(movements[j])) {
          duplicates.push(movements[j]);
          alreadySeen.add(j);
        }
      }
      if (duplicates.length > 1) {
        results.push(duplicates);
      }
    }
    return results;
  }

  findMovementsWithSameField(
    movements: Array<MovementDto>,
    field: string
  ): Array<Array<MovementDto>> {
    const results = [];
    const strictlyEqualMovementsSet = new Set();
    const strictlyEqualMovements = this.findStrictlyEqualMovements(movements);
    strictlyEqualMovements.forEach((pair) => {
      strictlyEqualMovementsSet.add(JSON.stringify(pair[0]));
      strictlyEqualMovementsSet.add(JSON.stringify(pair[1]));
    });

    for (let i = 0; i < movements.length; i++) {
      for (let j = i + 1; j < movements.length; j++) {
        if (movements[i][field] === movements[j][field]) {
          const mv1String = JSON.stringify(movements[i]);
          const mv2String = JSON.stringify(movements[j]);
          if (
            !strictlyEqualMovementsSet.has(mv1String) &&
            !strictlyEqualMovementsSet.has(mv2String)
          ) {
            results.push([movements[i], movements[j]]);
          }
        }
      }
    }
    return results;
  }
}
