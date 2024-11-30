import { ClaseEntity } from '../../clase/clase.entity/clase.entity';
import { UsuarioEntity } from '../../usuario/usuario.entity/usuario.entity';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BonoEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  monto: number;

  @Column('float')
  calificacion: number;

  @Column()
  palabraClave: string;

  @ManyToOne(() => UsuarioEntity, (usuario) => usuario.bonos)
  usuario: UsuarioEntity;

  @ManyToOne(() => ClaseEntity, (clase) => clase.bonos)
  clase: ClaseEntity;
}
