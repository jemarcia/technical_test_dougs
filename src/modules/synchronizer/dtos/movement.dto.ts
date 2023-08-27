import { IsDate, IsNumber, IsString } from 'class-validator';

export class MovementDto {
  @IsNumber()
  id: number;

  @IsDate()
  date: Date;

  @IsString()
  wording: string;

  @IsNumber()
  amount: number;
}
