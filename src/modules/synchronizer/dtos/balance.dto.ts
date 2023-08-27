import { IsDate, IsNumber } from 'class-validator';

export class BalanceDto {
  @IsDate()
  date: Date;

  @IsNumber()
  balance: number;
}
