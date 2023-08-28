import { Injectable } from '@nestjs/common';
import { MovementDto } from '../dtos/movement.dto';
import { BalanceDto } from '../dtos/balance.dto';

@Injectable()
export class SynchronizerService {
  checkMovements(movements: Array<MovementDto>, balances: Array<BalanceDto>) {
    movements.sort((a, b) => a.date.getTime() - b.date.getTime());
    balances.sort((a, b) => a.date.getTime() - b.date.getTime());

    const firstDateBalances = balances[0].date;
    const operationsBeforeFirstBalance = movements.filter(
      (mv) => mv.date.getTime() < firstDateBalances.getTime()
    );

    if (operationsBeforeFirstBalance.length > 0) {
      return {
        message: 'I’m a teapot',
        reasons: [
          {
            message:
              'Certaines opérations ne peuvent pas être vérifiées car leur date est antérieure au plus ancien point de contrôle, veuillez les retirer pour procéder à la vérification.',
            invalidOperations: operationsBeforeFirstBalance
          }
        ]
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
          balanceDate: balances[i + 1].date,
          expectedBalance: balances[i + 1].balance,
          actualBalance: currentBalance,
          reasons: [
            {
              reason: 'Déséquilibre entre mouvements et balance',
              invalidMovements: periodMovements
            }
          ]
        };

        // Chercher des mouvements strictement égaux
        const strictlyEqualMovements =
          this.findStrictlyEqualMovements(periodMovements);
        if (strictlyEqualMovements.length) {
          imbalanceReason.reasons.push({
            reason: 'Ces opérations sont strictement égales',
            invalidMovements: strictlyEqualMovements
          });
        }

        // Chercher des mouvements ayant le même ID
        const sameIDMovements = this.findMovementsWithSameField(
          periodMovements,
          'id'
        );
        if (sameIDMovements.length) {
          imbalanceReason.reasons.push({
            reason: 'Ces opérations ont le même identifiant',
            invalidMovements: sameIDMovements
          });
        }

        const sameDates = this.findMovementsWithSameField(
          periodMovements,
          'date'
        );
        if (sameDates.length) {
          imbalanceReason.reasons.push({
            reason: 'Ces opérations ont la même date',
            invalidMovements: sameDates
          });
        }

        const sameAmounts = this.findMovementsWithSameField(
          periodMovements,
          'amount'
        );
        if (sameAmounts.length) {
          imbalanceReason.reasons.push({
            reason: 'Ces opérations ont le même montant',
            invalidMovements: sameAmounts
          });
        }

        // Ajoutez d'autres appels de fonction ici pour d'autres critères si nécessaire.

        reasons.push(imbalanceReason);
      }
    }

    if (reasons.length === 0) {
      return {
        message: 'Accepted'
      };
    } else {
      return {
        message: 'I’m a teapot',
        reasons: reasons
      };
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

  // checkMovements(movements: Array<MovementDto>, balances: Array<BalanceDto>) {
  //   movements.sort((a, b) => a.date.getTime() - b.date.getTime());
  //   balances.sort((a, b) => a.date.getTime() - b.date.getTime());

  //   const firstDateBalances = balances[0].date;
  //   const operationsBeforeFirstBalance = movements.filter(
  //     (mv) => mv.date.getTime() < firstDateBalances.getTime()
  //   );

  //   if (operationsBeforeFirstBalance.length > 0) {
  //     return {
  //       message: 'I’m a teapot',
  //       reasons: [
  //         {
  //           message:
  //             'Certaines opérations ne peuvent pas être vérifiées car leur date est antérieure au plus ancien point de contrôle',
  //           invalidOperations: operationsBeforeFirstBalance
  //         }
  //       ]
  //     };
  //   }
  //   const reasons = [];
  //   let lastCheckedMovementIndex = 0;

  //   for (let i = 0; i < balances.length - 1; i++) {
  //     let currentBalance = balances[i].balance;
  //     const periodMovements = [];

  //     for (let j = lastCheckedMovementIndex; j < movements.length; j++) {
  //       const movement = movements[j];

  //       if (
  //         new Date(movement.date).getTime() <
  //         new Date(balances[i + 1].date).getTime()
  //       ) {
  //         currentBalance += movement.amount;
  //         periodMovements.push(movement);
  //         lastCheckedMovementIndex = j + 1;
  //       } else {
  //         break;
  //       }
  //     }

  //     if (currentBalance !== balances[i + 1].balance) {
  //       const invalidReasons = [
  //         {
  //           reason: 'Déséquilibre entre mouvements et balance',
  //           invalidMovements: periodMovements
  //         }
  //       ];

  //       const strictlyEquals = this.findStrictlyEqualMovements(periodMovements);
  //       if (strictlyEquals.length > 0) {
  //         invalidReasons.push({
  //           reason: 'Ces opérations sont strictement égales',
  //           invalidMovements: strictlyEquals.flat()
  //         });
  //       }

  //       const filteredMovements = this.filterOutStrictlyEqualMovements(
  //         periodMovements,
  //         strictlyEquals
  //       );
  //       const sameIds = this.findMovementsWithSameProperty(
  //         filteredMovements,
  //         'id'
  //       );
  //       const sameDates = this.findMovementsWithSameProperty(
  //         filteredMovements,
  //         'date'
  //       );
  //       const sameAmounts = this.findMovementsWithSameProperty(
  //         filteredMovements,
  //         'amount'
  //       );

  //       if (sameIds.length > 0) {
  //         invalidReasons.push({
  //           reason: 'Ces opérations ont le même identifiant',
  //           invalidMovements: sameIds.flat()
  //         });
  //       }
  //       if (sameDates.length > 0) {
  //         invalidReasons.push({
  //           reason: 'Ces opérations ont la même date',
  //           invalidMovements: sameDates.flat()
  //         });
  //       }
  //       if (sameAmounts.length > 0) {
  //         invalidReasons.push({
  //           reason: 'Ces opérations ont le même montant',
  //           invalidMovements: sameAmounts.flat()
  //         });
  //       }

  //       reasons.push({
  //         balanceDate: balances[i + 1].date,
  //         expectedBalance: balances[i + 1].balance,
  //         actualBalance: currentBalance,
  //         reasons: invalidReasons
  //       });
  //     }
  //   }

  //   if (reasons.length === 0) {
  //     return {
  //       message: 'Accepted'
  //     };
  //   } else {
  //     return {
  //       message: 'I’m a teapot',
  //       reasons: reasons
  //     };
  //   }
  // }

  // findMovementsWithSameProperty(
  //   movements: Array<MovementDto>,
  //   property: keyof MovementDto
  // ): Array<Array<MovementDto>> {
  //   const seen = new Map();
  //   const duplicates = [];

  //   for (const movement of movements) {
  //     const value = movement[property];
  //     if (seen.has(value)) {
  //       seen.get(value).push(movement);
  //     } else {
  //       seen.set(value, [movement]);
  //     }
  //   }

  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   for (const [_, group] of seen.entries()) {
  //     if (group.length > 1) {
  //       duplicates.push(group);
  //     }
  //   }

  //   return duplicates;
  // }

  // filterOutStrictlyEqualMovements(
  //   movements: Array<MovementDto>,
  //   strictlyEquals: Array<Array<MovementDto>>
  // ): Array<MovementDto> {
  //   const strictlyEqualSet = new Set(
  //     strictlyEquals.flat().map((mov) => mov.id)
  //   );
  //   return movements.filter((mov) => !strictlyEqualSet.has(mov.id));
  // }

  // findStrictlyEqualMovements(
  //   movements: Array<MovementDto>
  // ): Array<Array<MovementDto>> {
  //   const duplicates = [];
  //   const seen = new Set<string>();

  //   for (let i = 0; i < movements.length; i++) {
  //     const currentMovement = movements[i];
  //     const currentMovementStr = JSON.stringify(currentMovement);
  //     if (seen.has(currentMovementStr)) {
  //       continue; // Ignore if we've already seen this exact movement
  //     }

  //     const equalMovements = movements.filter((movement, index) => {
  //       if (index <= i) return false; // Ignore previous and current movements
  //       return JSON.stringify(movement) === currentMovementStr;
  //     });

  //     if (equalMovements.length > 0) {
  //       duplicates.push([currentMovement, ...equalMovements]);
  //       seen.add(currentMovementStr);
  //     }
  //   }

  //   return duplicates;
  // }
}
