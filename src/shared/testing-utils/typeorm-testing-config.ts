/* eslint-disable prettier/prettier */
/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedSocialEntity } from '../../red-social/red-social.entity/red-social.entity';
import { FotoEntity } from '../../foto/foto.entity/foto.entity';
import { AlbumEntity } from '../../album/album.entity/album.entity';
import { UsuarioEntity } from '../../usuario/usuario.entity/usuario.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [RedSocialEntity, FotoEntity, AlbumEntity, UsuarioEntity],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([
    RedSocialEntity,
    FotoEntity,
    AlbumEntity,
    UsuarioEntity,
  ]),
];
