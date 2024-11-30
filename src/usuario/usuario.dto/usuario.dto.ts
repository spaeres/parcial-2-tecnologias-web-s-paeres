import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class UsuarioDto {
  @IsNotEmpty()
  @IsNumber()
  readonly numeroCedula: number;

  @IsNotEmpty()
  @IsString()
  readonly nombre: string;

  @IsNotEmpty()
  @IsString()
  readonly grupoInvestigacion: string;

  @IsNotEmpty()
  @IsNumber()
  readonly numeroExtension: number;

  @IsNotEmpty()
  @IsString()
  readonly rol: string;
}
