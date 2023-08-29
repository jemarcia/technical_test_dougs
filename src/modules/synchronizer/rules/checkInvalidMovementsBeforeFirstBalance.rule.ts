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
              'Certaines opérations ne peuvent pas être vérifiées car leur date est antérieure au plus ancien point de contrôle, veuillez les retirer pour procéder à la vérification.',
            invalidMovements: movementsBeforeFirstBalance
          }
        ]
      };
    }

    return null;
  }
}
