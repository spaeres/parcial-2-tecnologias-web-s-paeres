import { BonoEntity } from '../../bono/bono.entity/bono.entity';
import { ClaseEntity } from '../../clase/clase.entity/clase.entity';
import {
  Entity,
  Column,
  JoinColumn,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class UsuarioEntity {
  // Esto es para que sea un long:
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  numeroCedula: number;

  @Column()
  nombre: string;

  @Column({})
  grupoInvestigacion: string;

  @Column()
  numeroExtension: number;

  @Column({})
  rol: string;

  @OneToOne(() => UsuarioEntity, (jefe) => jefe.usuario)
  @JoinColumn()
  usuario: UsuarioEntity;

  @OneToMany(() => BonoEntity, (bono) => bono.usuario)
  bonos: BonoEntity[];

  @OneToMany(() => ClaseEntity, (clase) => clase.usuario)
  clases: BonoEntity[];
}
