import { Module } from '@nestjs/common';
import { ClaseService } from './clase.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClaseEntity } from './clase.entity/clase.entity';
import { BonoEntity } from 'src/bono/bono.entity/bono.entity';
import { BonoModule } from 'src/bono/bono.module';

@Module({
  imports: [TypeOrmModule.forFeature([ClaseEntity, BonoEntity]), BonoModule],
  providers: [ClaseService],
  exports: [ClaseService],
})
export class ClaseModule {}
