import {
  Body,
  Controller,
  Post,
  Get,
  UseInterceptors,
  Delete,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { BonoService } from './bono.service';
import { BonoEntity } from './bono.entity/bono.entity';
import { plainToInstance } from 'class-transformer';
import { BonoDto } from './bono.dto/bono.dto';
import { Param } from '@nestjs/common';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('bono')
export class BonoController {
  constructor(private readonly bonoService: BonoService) {}

  @Post(':usuarioID')
  async createBono(
    @Param('usuarioID') usuarioID: number,
    @Body() bonoDto: BonoDto,
  ) {
    // Acá se mapean los datos del DTO a la entidad:
    const bono: BonoEntity = plainToInstance(BonoEntity, bonoDto);
    return await this.bonoService.createBono(bono, usuarioID);
  }

  @Get('codigo/:codigo')
  async findOneCodigo(@Param('codigo') codigo: string) {
    return await this.bonoService.findBonosByCodigo(codigo);
  }

  @Get('usuario/:usuarioId')
  async findOneUsuario(@Param('usuarioId') usuarioId: number) {
    return await this.bonoService.findAllBonosByUsuario(usuarioId);
  }

  @Delete(':bonoId')
  async delete(@Param('bonoId') bonoId: number) {
    return await this.bonoService.deleteBono(bonoId);
  }
}
