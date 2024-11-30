import { Controller } from '@nestjs/common';
import { ClaseService } from '../clase/clase.service';
import { ClaseEntity } from '../clase/clase.entity/clase.entity';
import { plainToInstance } from 'class-transformer';
import { ClaseDto } from '../clase/clase.dto/clase.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { Body, Get, Param, Post, UseInterceptors } from '@nestjs/common';

@Controller('clase')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClaseController {
  constructor(private readonly claseService: ClaseService) {}

  @Get(':claseId')
  async findOne(@Param('claseId') claseId: number) {
    return await this.claseService.findClaseById(claseId);
  }

  @Post()
  async create(@Body() claseDTO: ClaseDto) {
    const clase: ClaseEntity = plainToInstance(ClaseEntity, claseDTO);
    return await this.claseService.crearClase(clase);
  }
}
