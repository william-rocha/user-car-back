// create-car.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCarDto {
  @IsString({ message: 'A placa deve ser uma string não vazia.' })
  @IsNotEmpty({ message: 'A placa não pode estar vazia.' })
  placa: string;

  @IsString({ message: 'A cor fornecida não é válida.' })
  @IsNotEmpty({ message: 'A cor não pode estar vazia.' })
  cor: string;

  @IsString({ message: 'A marca deve ser uma string não vazia.' })
  @IsNotEmpty({ message: 'A marca não pode estar vazia.' })
  marca: string;
}
