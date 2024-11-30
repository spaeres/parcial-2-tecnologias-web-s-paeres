import { Controller } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioDto } from './usuario.dto/usuario.dto';
import { UsuarioEntity } from './usuario.entity/usuario.entity';
import { plainToInstance } from 'class-transformer';
import { Body, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get(':usuarioId')
  async findOne(@Param('usuarioId') usuarioId: number) {
    return await this.usuarioService.findUsuarioById(usuarioId);
  }

  @Post()
  async create(@Body() usuarioDTO: UsuarioDto) {
    const usuario: UsuarioEntity = plainToInstance(UsuarioEntity, usuarioDTO);
    return await this.usuarioService.crearUsuario(usuario);
  }

  @Delete(':usuarioId')
  @HttpCode(204)
  async delete(@Param('usuarioId') usuarioId: number) {
    return await this.usuarioService.eliminarUsuario(usuarioId);
  }
}
