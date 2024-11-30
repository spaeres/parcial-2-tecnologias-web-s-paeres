import { Module } from '@nestjs/common';
import { ClaseService } from './clase.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClaseEntity } from './clase.entity/clase.entity';
import { ClaseController } from '../clase/clase.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ClaseEntity])],
  providers: [ClaseService],
  controllers: [ClaseController],
  exports: [ClaseService],
})
export class ClaseModule {}
