import { CheckInvalidMovementsBeforeFirstBalanceRule } from '../../rules/checkInvalidMovementsBeforeFirstBalance.rule';
import { MovementDto } from '../../dtos/movement.dto';

describe('CheckInvalidMovementsBeforeFirstBalanceRule', () => {
  it('should return null if all movements are after the first balance date', () => {
    const movements: Array<MovementDto> = [
      {
        id: 1,
        date: new Date('2023-08-29T00:00:00.000Z'),
        wording: 'Movement 1',
        amount: 100
      },
      {
        id: 2,
        date: new Date('2023-08-30T00:00:00.000Z'),
        wording: 'Movement 2',
        amount: -150
      }
    ];

    const firstDateBalances = new Date('2023-08-28T00:00:00.000Z');

    const result = CheckInvalidMovementsBeforeFirstBalanceRule.execute(
      movements,
      firstDateBalances
    );

    expect(result).toBeNull();
  });

  it('should return rejected status and reasons if some movements are before the first balance date', () => {
    const movements: Array<MovementDto> = [
      {
        id: 1,
        date: new Date('2023-08-25T00:00:00.000Z'),
        wording: 'Movement 1',
        amount: 100
      },
      {
        id: 2,
        date: new Date('2023-08-26T00:00:00.000Z'),
        wording: 'Movement 2',
        amount: 120
      },
      {
        id: 3,
        date: new Date('2023-08-29T00:00:00.000Z'),
        wording: 'Movement 3',
        amount: -150
      }
    ];

    const firstDateBalances = new Date('2023-08-28T00:00:00.000Z');

    const result = CheckInvalidMovementsBeforeFirstBalanceRule.execute(
      movements,
      firstDateBalances
    );

    expect(result).toEqual({
      status: 'Rejected',
      reasons: [
        {
          reason:
            'Some movements cannot be verified because their date is older than the oldest checkpoint, please remove them for verification.',
          invalidMovements: [
            {
              id: 1,
              date: new Date('2023-08-25T00:00:00.000Z'),
              wording: 'Movement 1',
              amount: 100
            },
            {
              id: 2,
              date: new Date('2023-08-26T00:00:00.000Z'),
              wording: 'Movement 2',
              amount: 120
            }
          ]
        }
      ]
    });
  });
});
