import { Module } from '@nestjs/common';
import { BonoService } from './bono.service';
import { BonoEntity } from './bono.entity/bono.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonoController } from './bono.controller';
import { UsuarioEntity } from 'src/usuario/usuario.entity/usuario.entity';
import { UsuarioModule } from 'src/usuario/usuario.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BonoEntity, UsuarioEntity]),
    UsuarioModule,
  ],
  providers: [BonoService],
  exports: [BonoService],
  controllers: [BonoController],
})
export class BonoModule {}
