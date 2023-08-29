import { MovementDto } from '../dtos/movement.dto';
import { ValidationResult } from '../interfaces/validation.interface';

export class CheckInvalidMovementsBeforeFirstBalanceRule {
  static execute(
    movements: Array<MovementDto>,
    firstDateBalances: Date
  ): ValidationResult | null {
    const movementsBeforeFirstBalance = movements.filter(
      (mv) => mv.date.getTime() < firstDateBalances.getTime()
    );

    if (movementsBeforeFirstBalance.length > 0) {
      return {
        status: 'Rejected',
        reasons: [
          {
            reason:
              'Some movements cannot be verified because their date is older than the oldest checkpoint, please remove them for verification.',
            invalidMovements: movementsBeforeFirstBalance
          }
        ]
      };
    }

    return null;
  }
}
