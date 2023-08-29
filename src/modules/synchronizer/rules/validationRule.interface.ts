import { BalanceDto } from '../dtos/balance.dto';
import { MovementDto } from '../dtos/movement.dto';
import { ValidationResult } from '../interfaces/validation.interface';

export interface ValidationRule {
  validate(
    movements: Array<MovementDto>,
    balances: Array<BalanceDto>
  ): ValidationResult;
}
