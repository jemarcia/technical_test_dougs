import { MovementDto } from '../../dtos/movement.dto';
import { FindStrictlyEqualMovements } from '../../helpers/findStrictlyEqualMovements.helper';

describe('FindStrictlyEqualMovements', () => {
  it('should return empty array for no duplicate movements', () => {
    const movements: MovementDto[] = [
      {
        id: 1,
        date: new Date('2023-08-23'),
        wording: 'Operation 1',
        amount: 100
      },
      {
        id: 2,
        date: new Date('2023-08-24'),
        wording: 'Operation 2',
        amount: -50
      },
      {
        id: 3,
        date: new Date('2023-08-25'),
        wording: 'Operation 3',
        amount: 200
      }
    ];

    const duplicates = FindStrictlyEqualMovements.execute(movements);
    expect(duplicates).toEqual([]);
  });

  it('should find strictly equal movements', () => {
    const movements: MovementDto[] = [
      {
        id: 1,
        date: new Date('2023-08-23'),
        wording: 'Operation 1',
        amount: 100
      },
      {
        id: 2,
        date: new Date('2023-08-24'),
        wording: 'Operation 2',
        amount: -50
      },
      {
        id: 1,
        date: new Date('2023-08-23'),
        wording: 'Operation 1',
        amount: 100
      } // Duplicate
    ];

    const duplicates = FindStrictlyEqualMovements.execute(movements);
    expect(duplicates).toEqual([[movements[0], movements[2]]]);
  });

  it('should find multiple sets of strictly equal movements', () => {
    const movements: MovementDto[] = [
      {
        id: 1,
        date: new Date('2023-08-23'),
        wording: 'Operation 1',
        amount: 100
      },
      {
        id: 2,
        date: new Date('2023-08-24'),
        wording: 'Operation 2',
        amount: -50
      },
      {
        id: 1,
        date: new Date('2023-08-23'),
        wording: 'Operation 1',
        amount: 100
      }, // Duplicate
      {
        id: 3,
        date: new Date('2023-08-25'),
        wording: 'Operation 3',
        amount: 200
      },
      {
        id: 3,
        date: new Date('2023-08-25'),
        wording: 'Operation 3',
        amount: 200
      } // Duplicate
    ];

    const duplicates = FindStrictlyEqualMovements.execute(movements);
    expect(duplicates).toEqual([
      [movements[0], movements[2]],
      [movements[3], movements[4]]
    ]);
  });
});
