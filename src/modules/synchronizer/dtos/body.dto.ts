import { IsArray, ValidateNested } from 'class-validator';
import { MovementDto } from './movement.dto';
import { Type } from 'class-transformer';
import { BalanceDto } from './balance.dto';

export class BodyDataDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MovementDto)
  movements: MovementDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BalanceDto)
  balances: BalanceDto[];
}
