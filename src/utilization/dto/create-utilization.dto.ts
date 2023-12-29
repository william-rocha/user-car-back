// create-utilization.dto.ts
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUtilizationDto {
  @IsString({ message: 'O [motivoUtilizacao] deve ser uma string não vazia.' })
  @IsNotEmpty({ message: 'O [motivoUtilizacao] não pode estar vazio.' })
  motivoUtilizacao: string;

  @IsNumber({}, { message: 'O driverId deve ser um número.' })
  @IsNotEmpty({ message: 'O driverId não pode estar vazio.' })
  driverId: number;

  @IsNumber({}, { message: 'O carId deve ser um número.' })
  @IsNotEmpty({ message: 'O carId não pode estar vazio.' })
  carId: number;
}
