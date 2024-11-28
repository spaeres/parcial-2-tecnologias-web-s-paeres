import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class BonoDto {
  @IsString()
  @IsNotEmpty()
  monto: string;

  @IsString()
  @IsNotEmpty()
  calificacion: string;

  @IsString()
  @IsNotEmpty()
  palabraClave: string;
}
