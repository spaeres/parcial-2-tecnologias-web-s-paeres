import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class BonoDto {
  @IsNumber()
  @IsNotEmpty()
  monto: number;

  @IsNumber()
  @IsNotEmpty()
  calificacion: number;

  @IsString()
  @IsNotEmpty()
  palabraClave: string;
}
