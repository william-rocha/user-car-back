// create-driver.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDriverDto {
  @IsString({ message: 'O nome deve ser uma string não vazia.' })
  @IsNotEmpty({ message: 'O nome não pode estar vazio.' })
  nome: string;
}
