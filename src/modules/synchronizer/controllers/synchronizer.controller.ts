import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Post
} from '@nestjs/common';
import { SynchronizerService } from '../services/synchronizer.service';
import { ValidateMovementsDto } from '../dtos/validateMovements.dto';
import { ValidationResult } from '../interfaces/validation.interface';

@Controller()
export class SynchronizerController {
  constructor(private readonly synchronizerService: SynchronizerService) {}

  private readonly logger = new Logger('SynchronizerController');

  @HttpCode(HttpStatus.OK)
  @Post('/movements/validation')
  async validateMovements(
    @Body()
    { movements, balances }: ValidateMovementsDto
  ) {
    const result: ValidationResult = this.synchronizerService.checkMovements(
      movements,
      balances
    );

    if (result.status === 'Accepted') {
      return { statusCode: HttpStatus.ACCEPTED, message: 'Accepted' };
    } else {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'Unprocessable Entity',
          reasons: result
        },
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }
  }
}
