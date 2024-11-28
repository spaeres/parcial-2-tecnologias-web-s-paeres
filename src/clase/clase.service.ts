import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClaseEntity } from '../clase/clase.entity/clase.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class ClaseService {
  constructor(
    @InjectRepository(ClaseEntity)
    private readonly claseRepository: Repository<ClaseEntity>,
  ) {}

  async crearClase(clase: ClaseEntity): Promise<ClaseEntity> {
    if (clase.codigo.length !== 10) {
      throw new BusinessLogicException(
        'El código de la clase debe tener exactamente 10 caracteres',
        BusinessError.BAD_REQUEST,
      );
    }

    return await this.claseRepository.save(clase);
  }

  async findClaseById(id: number): Promise<ClaseEntity> {
    const album: ClaseEntity = await this.claseRepository.findOne({
      where: { id },
      relations: ['bonos'],
    });
    if (!album)
      throw new BusinessLogicException(
        'La clase con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );

    return album;
  }
}
