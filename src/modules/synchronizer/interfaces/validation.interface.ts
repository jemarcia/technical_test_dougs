import { MovementDto } from '../dtos/movement.dto';

export interface Reason {
  reason: string;
  balanceDate?: Date;
  expectedBalance?: number;
  actualBalance?: number;
  invalidMovements: Array<MovementDto>;
  potentialCauses?: Array<{
    potentialCause: string;
    invalidMovements: Array<MovementDto>;
  }>;
}

export interface ValidationResult {
  status: 'Accepted' | 'Rejected';
  reasons?: Array<Reason>;
}
