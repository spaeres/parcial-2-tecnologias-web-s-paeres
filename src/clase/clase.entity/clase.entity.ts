import { BonoEntity } from '../../bono/bono.entity/bono.entity';
import { UsuarioEntity } from '../../usuario/usuario.entity/usuario.entity';
import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ClaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  nombre: string;

  @Column()
  codigo: string;

  @Column()
  numeroCreditos: number;

  @ManyToOne(() => UsuarioEntity, (usuario) => usuario.clases)
  usuario: UsuarioEntity;

  @OneToMany(() => BonoEntity, (bono) => bono.clase)
  bonos: BonoEntity[];
}
