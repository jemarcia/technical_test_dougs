import { Type } from 'class-transformer';
import { IsDate, IsNumber } from 'class-validator';

export class BalanceDto {
  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsNumber()
  balance: number;
}
