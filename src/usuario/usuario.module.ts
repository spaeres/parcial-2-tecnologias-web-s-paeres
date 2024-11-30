import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './usuario.entity/usuario.entity';
import { BonoEntity } from 'src/bono/bono.entity/bono.entity';
import { ClaseEntity } from 'src/clase/clase.entity/clase.entity';
import { BonoModule } from 'src/bono/bono.module';
import { ClaseModule } from 'src/clase/clase.module';
import { UsuarioController } from './usuario.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity])],
  providers: [UsuarioService],
  exports: [UsuarioService],
  controllers: [UsuarioController],
})
export class UsuarioModule {}
