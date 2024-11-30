import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class ClaseDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly codigo: string;

  @IsNumber()
  @IsNotEmpty()
  readonly numeroCreditos: number;
}
