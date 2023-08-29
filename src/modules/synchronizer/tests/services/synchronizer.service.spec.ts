import { SynchronizerService } from '../../services/synchronizer.service';
import { MovementDto } from '../../dtos/movement.dto';
import { BalanceDto } from '../../dtos/balance.dto';

describe('SynchronizerService', () => {
  let synchronizerService: SynchronizerService;

  beforeEach(() => {
    synchronizerService = new SynchronizerService();
  });

  describe('checkMovements', () => {
    it('should return Accepted if movements and balances are valid', () => {
      const movements: MovementDto[] = [
        {
          id: 1,
          date: new Date('2021-01-02'),
          wording: 'Movement 1',
          amount: 100
        },
        {
          id: 2,
          date: new Date('2021-01-02'),
          wording: 'Movement 2',
          amount: -50
        },
        {
          id: 3,
          date: new Date('2021-01-04'),
          wording: 'Movement 3',
          amount: -25
        }
      ];
      const balances: BalanceDto[] = [
        { date: new Date('2021-01-01'), balance: 100 },
        { date: new Date('2021-01-03'), balance: 150 },
        { date: new Date('2021-01-05'), balance: 125 }
      ];

      const result = synchronizerService.checkMovements(movements, balances);

      expect(result.status).toEqual('Accepted');
    });
  });
});
