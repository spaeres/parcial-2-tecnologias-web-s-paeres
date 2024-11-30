import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BonoEntity } from '../bono/bono.entity/bono.entity';
import { UsuarioEntity } from '../usuario/usuario.entity/usuario.entity';
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

    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
  ) {}

  async createBono(bono: BonoEntity, usuarioID: number): Promise<BonoEntity> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id: usuarioID },
    });

    if (!usuario) {
      throw new BusinessLogicException(
        `El usuario con ID ${usuarioID} no existe`,
        BusinessError.BAD_REQUEST,
      );
    }

    // Verificar si el usuario tiene el rol "Profesor"
    if (usuario.rol !== 'Profesor') {
      throw new BusinessLogicException(
        'Solo un usuario con rol Profesor puede crear un bono',
        BusinessError.BAD_REQUEST,
      );
    }

    // Validar el monto del bono
    if (!bono.monto || bono.monto <= 0) {
      throw new BusinessLogicException(
        'El monto debe ser un valor positivo y no puede estar vacio',
        BusinessError.BAD_REQUEST,
      );
    }

    bono.usuario = usuario;

    return await this.bonoRepository.save(bono);
  }

  async findBonosByCodigo(codigo: string): Promise<BonoEntity[]> {
    const bonos = await this.bonoRepository.find({
      where: { clase: { codigo: codigo } },
      relations: ['clase'],
    });

    console.log('Bonos encontrados:', bonos);

    if (!bonos || bonos.length === 0) {
      throw new BusinessLogicException(
        'No se encontraron bonos con el código de clase especificado',
        BusinessError.NOT_FOUND,
      );
    }

    return bonos;
  }

  async findAllBonosByUsuario(usuarioId: number): Promise<BonoEntity[]> {
    // Busca los bonos asociados al usuario por su ID
    const bonos = await this.bonoRepository.find({
      where: { usuario: { id: usuarioId } },
      relations: ['usuario'],
    });

    // Verifica si no se encontraron bonos y lanza un error en ese caso
    if (!bonos || bonos.length === 0) {
      throw new BusinessLogicException(
        `No se encontraron bonos para el usuario con ID ${usuarioId}`,
        BusinessError.NOT_FOUND,
      );
    }
    return bonos;
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
