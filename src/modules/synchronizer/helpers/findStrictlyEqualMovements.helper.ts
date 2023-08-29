import { MovementDto } from '../dtos/movement.dto';

export class FindStrictlyEqualMovements {
  static execute(movements: Array<MovementDto>): Array<Array<MovementDto>> {
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
}
