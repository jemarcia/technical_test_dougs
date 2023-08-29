import { CheckBalancesAgainstMovementsRule } from '../../rules/checkBalancesAgainstMovements.rule';
import { MovementDto } from '../../dtos/movement.dto';
import { BalanceDto } from '../../dtos/balance.dto';

describe('CheckBalancesAgainstMovementsRule', () => {
  it('should return empty array if balances match movements', () => {
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
        amount: -150
      }
    ];

    const balances: Array<BalanceDto> = [
      {
        date: new Date('2023-08-28T00:00:00.000Z'),
        balance: 0
      },
      {
        date: new Date('2023-08-30T00:00:00.000Z'),
        balance: -50
      }
    ];

    const result = CheckBalancesAgainstMovementsRule.execute(
      movements,
      balances
    );

    expect(result).toEqual([]);
  });

  it('should return array of reasons for imbalances', () => {
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
        amount: -150
      }
    ];

    const balances: Array<BalanceDto> = [
      {
        date: new Date('2023-08-28T00:00:00.000Z'),
        balance: 0
      },
      {
        date: new Date('2023-08-30T00:00:00.000Z'),
        balance: -200
      }
    ];

    const result = CheckBalancesAgainstMovementsRule.execute(
      movements,
      balances
    );

    expect(result).toEqual([
      {
        reason: 'Imbalance between movements and balance',
        balanceDate: new Date('2023-08-30T00:00:00.000Z'),
        expectedBalance: -200,
        actualBalance: -50,
        invalidMovements: [
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
            amount: -150
          }
        ],
        potentialCauses: [
          {
            potentialCause: 'These movements have the same date',
            invalidMovements: [
              [
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
                  amount: -150
                }
              ]
            ]
          }
        ]
      }
    ]);
  });

  it('should return array of reasons with multiple potentialCauses', () => {
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

    const balances: Array<BalanceDto> = [
      {
        date: new Date('2023-08-28T00:00:00.000Z'),
        balance: 0
      },
      {
        date: new Date('2023-08-30T00:00:00.000Z'),
        balance: -200
      }
    ];

    const result = CheckBalancesAgainstMovementsRule.execute(
      movements,
      balances
    );

    expect(result).toEqual([
      {
        reason: 'Imbalance between movements and balance',
        balanceDate: new Date('2023-08-30T00:00:00.000Z'),
        expectedBalance: -200,
        actualBalance: 450,
        invalidMovements: [
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
        ],
        potentialCauses: [
          {
            potentialCause: 'These movements have the same identifier',
            invalidMovements: [
              [
                {
                  id: 1,
                  date: new Date('2023-08-29T00:00:00.000Z'),
                  wording: 'Movement 1',
                  amount: 100
                },
                {
                  id: 1,
                  date: new Date('2023-08-29T00:00:00.000Z'),
                  wording: 'Movement 3',
                  amount: 200
                }
              ]
            ]
          },
          {
            potentialCause: 'These movements have the same date',
            invalidMovements: [
              [
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
              ]
            ]
          }
        ]
      }
    ]);
  });
});
