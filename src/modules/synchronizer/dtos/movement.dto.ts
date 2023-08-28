import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class MovementDto {
  @IsNumber()
  id: number;

  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsString()
  wording: string;

  @IsNumber()
  amount: number;
}
