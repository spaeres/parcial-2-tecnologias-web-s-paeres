import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BonoEntity } from '../bono/bono.entity/bono.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class BonoService {
  constructor(
    @InjectRepository(BonoEntity)
    private readonly bonoRepository: Repository<BonoEntity>,
  ) {}

  async createBono(bono: BonoEntity): Promise<BonoEntity> {
    if (!bono.monto) {
      throw new BusinessLogicException(
        'El monto no puede estar vacío',
        BusinessError.BAD_REQUEST,
      );
    }

    if (bono.monto <= 0) {
      throw new BusinessLogicException(
        'El monto debe ser positivo',
        BusinessError.BAD_REQUEST,
      );
    }

    if (bono.usuario?.rol !== 'Profesor') {
      throw new BusinessLogicException(
        'Solo los usuarios con rol Profesor pueden tener bonos',
        BusinessError.BAD_REQUEST,
      );
    }

    return await this.bonoRepository.save(bono);
  }

  async findBonoByCodigo(codigo: string): Promise<BonoEntity[]> {
    const bonos = await this.bonoRepository.find({
      where: { clase: { codigo: codigo } },
      relations: ['clases'],
    });

    if (!bonos || bonos.length === 0) {
      throw new BusinessLogicException(
        'No se encontraron bonos con el código de clase especificado',
        BusinessError.NOT_FOUND,
      );
    }

    return bonos;
  }

  async findAllBonosByUsuario(usuarioId: number): Promise<BonoEntity[]> {
    return await this.bonoRepository.find({
      where: { usuario: { id: usuarioId } },
      relations: ['usuario'],
    });
  }

  async deleteBono(id: number) {
    const bono: BonoEntity = await this.bonoRepository.findOne({
      where: { id },
    });
    if (!bono)
      throw new BusinessLogicException(
        'El bono con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    if (bono.calificacion > 4) {
      throw new BusinessLogicException(
        'No se puede eliminar un bono con calificación mayor a 4',
        BusinessError.BAD_REQUEST,
      );
    }
    await this.bonoRepository.remove(bono);
  }
}
