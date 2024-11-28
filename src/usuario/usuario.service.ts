import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioEntity } from '../usuario/usuario.entity/usuario.entity';
import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/errors/business-errors';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
  ) {}

  async crearUsuario(usuario: UsuarioEntity): Promise<UsuarioEntity> {
    const gruposValidos = ['TICSW', 'IMAGINE', 'COMIT'];

    if (usuario.rol === 'Profesor') {
      if (!gruposValidos.includes(usuario.grupoInvestigacion)) {
        throw new BusinessLogicException(
          'El grupo de investigación debe ser TICSW, IMAGINE o COMIT para profesores',
          BusinessError.BAD_REQUEST,
        );
      }
    }

    if (usuario.rol === 'Decana') {
      const numeroExtensionStr = usuario.numeroExtension.toString();
      if (numeroExtensionStr.length !== 8) {
        throw new BusinessLogicException(
          'La extension no es correcta',
          BusinessError.BAD_REQUEST,
        );
      }
    }

    return await this.usuarioRepository.save(usuario);
  }

  async findUsuarioById(id: number): Promise<UsuarioEntity> {
    const user: UsuarioEntity = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['bonos', 'clases'],
    });
    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return user;
  }

  async eliminarUsuario(id: number) {
    const usuario: UsuarioEntity = await this.usuarioRepository.findOne({
      where: { id },
    });
    console.log(usuario);
    if (!usuario)
      throw new BusinessLogicException(
        'El usuario con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    if (usuario.bonos != null && usuario.bonos.length > 0)
      throw new BusinessLogicException(
        'El usuario no puede ser eliminado porque tiene bonos asociados',
        BusinessError.BAD_REQUEST,
      );

    await this.usuarioRepository.remove(usuario);
  }
}
