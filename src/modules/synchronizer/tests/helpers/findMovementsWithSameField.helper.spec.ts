import { MovementDto } from '../../dtos/movement.dto';
import { FindMovementsWithSameField } from '../../helpers/findMovementsWithSameField.helper';

describe('FindMovementsWithSameField', () => {
  it('should group movements with same ID', () => {
    const movements: Array<MovementDto> = [
      {
        id: 1,
        date: new Date('2023-08-29T00:00:00.000Z'),
        wording: 'Movement 1',
        amount: 100
      },
      {
        id: 2,
        date: new Date('2023-08-29T00:00:00.000Z'),
        wording: 'Movement 2',
        amount: 150
      },
      {
        id: 1,
        date: new Date('2023-08-29T00:00:00.000Z'),
        wording: 'Movement 3',
        amount: 200
      }
    ];

    const results = FindMovementsWithSameField.execute(movements, 'id');

    expect(results).toHaveLength(1);

    expect(results).toEqual(
      expect.arrayContaining([
        expect.arrayContaining([
          {
            id: 1,
            date: expect.any(Date),
            wording: 'Movement 1',
            amount: 100
          },
          {
            id: 1,
            date: expect.any(Date),
            wording: 'Movement 3',
            amount: 200
          }
        ])
      ])
    );
  });

  it('should group movements with same date', () => {
    const movements: Array<MovementDto> = [
      {
        id: 1,
        date: new Date('2023-08-29T00:00:00.000Z'),
        wording: 'Movement 1',
        amount: 100
      },
      {
        id: 2,
        date: new Date('2023-08-29T00:00:00.000Z'),
        wording: 'Movement 2',
        amount: 150
      },
      {
        id: 3,
        date: new Date('2023-08-29T00:00:00.000Z'),
        wording: 'Movement 3',
        amount: 200
      }
    ];

    const results = FindMovementsWithSameField.execute(movements, 'date');

    expect(results).toHaveLength(1);

    expect(results).toEqual(
      expect.arrayContaining([
        expect.arrayContaining([
          {
            id: 1,
            date: new Date('2023-08-29T00:00:00.000Z'),
            wording: 'Movement 1',
            amount: 100
          },
          {
            id: 2,
            date: new Date('2023-08-29T00:00:00.000Z'),
            wording: 'Movement 2',
            amount: 150
          },
          {
            id: 3,
            date: new Date('2023-08-29T00:00:00.000Z'),
            wording: 'Movement 3',
            amount: 200
          }
        ])
      ])
    );
  });

  it('should group movements with same amount', () => {
    const movements: Array<MovementDto> = [
      {
        id: 1,
        date: new Date('2023-08-29T00:00:00.000Z'),
        wording: 'Movement 1',
        amount: 100
      },
      {
        id: 2,
        date: new Date('2023-08-29T00:00:00.000Z'),
        wording: 'Movement 2',
        amount: 150
      },
      {
        id: 3,
        date: new Date('2023-08-29T00:00:00.000Z'),
        wording: 'Movement 3',
        amount: 100
      }
    ];

    const results = FindMovementsWithSameField.execute(movements, 'amount');

    expect(results).toHaveLength(1);

    expect(results).toEqual(
      expect.arrayContaining([
        expect.arrayContaining([
          {
            id: 1,
            date: expect.any(Date),
            wording: 'Movement 1',
            amount: 100
          },
          {
            id: 3,
            date: expect.any(Date),
            wording: 'Movement 3',
            amount: 100
          }
        ])
      ])
    );
  });

  it('should not group movements', () => {
    const movements: Array<MovementDto> = [
      {
        id: 1,
        date: new Date('2023-08-29T00:00:00.000Z'),
        wording: 'Movement 1',
        amount: 100
      },
      {
        id: 2,
        date: new Date('2023-08-29T00:00:00.000Z'),
        wording: 'Movement 2',
        amount: 150
      },
      {
        id: 3,
        date: new Date('2023-08-29T00:00:00.000Z'),
        wording: 'Movement 3',
        amount: 200
      }
    ];

    const results = FindMovementsWithSameField.execute(movements, 'id');

    expect(results).toHaveLength(0);
  });
});
