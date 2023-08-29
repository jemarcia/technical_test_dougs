import { MovementDto } from '../dtos/movement.dto';
import { FindStrictlyEqualMovements } from './findStrictlyEqualMovements.helper';

export class FindMovementsWithSameField {
  static execute(
    movements: Array<MovementDto>,
    field: string
  ): Array<Array<MovementDto>> {
    const groupedMovements: { [key: string]: Array<MovementDto> } = {};

    for (const movement of movements) {
      const fieldValue = movement[field];
      if (!groupedMovements[fieldValue]) {
        groupedMovements[fieldValue] = [];
      }
      groupedMovements[fieldValue].push(movement);
    }

    const results: Array<Array<MovementDto>> = [];

    for (const group of Object.values(groupedMovements)) {
      const strictlyEqualMovements = FindStrictlyEqualMovements.execute(group);
      const nonStrictlyEqualGroup = group.filter((movement) =>
        strictlyEqualMovements.every((pair) => !pair.includes(movement))
      );
      if (nonStrictlyEqualGroup.length > 1) {
        results.push(nonStrictlyEqualGroup);
      }
    }

    return results;
  }
}
