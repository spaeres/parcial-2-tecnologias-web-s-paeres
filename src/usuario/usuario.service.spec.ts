import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from './usuario.service';
import { UsuarioEntity } from './usuario.entity/usuario.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker/.';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let repository: Repository<UsuarioEntity>;
  let usuariosList: UsuarioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UsuarioService],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);

    repository = module.get<Repository<UsuarioEntity>>(
      getRepositoryToken(UsuarioEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    usuariosList = [];
    for (let i = 0; i < 5; i++) {
      const usuario: UsuarioEntity = await repository.save({
        numeroCedula: faker.number.int({ min: 1000000000, max: 9999999999 }),
        nombre: faker.person.fullName(),
        grupoInvestigacion: faker.helpers.arrayElement([
          'TICSW',
          'IMAGINE',
          'COMIT',
        ]),
        numeroExtension: faker.number.int({ min: 1, max: 99 }),
        rol: faker.helpers.arrayElement(['Profesor', 'Decano']),
      });
      usuariosList.push(usuario);
    }
  };

  // Crear usuario caso positivo:
  it('create should return a new usuario', async () => {
    const usuario: UsuarioEntity = {
      id: null,
      numeroCedula: faker.number.int({ min: 1000000000, max: 9999999999 }),
      nombre: faker.person.fullName(),
      grupoInvestigacion: faker.helpers.arrayElement([
        'TICSW',
        'IMAGINE',
        'COMIT',
      ]),
      // Se pone 8 para que siempre sirva:
      numeroExtension: faker.number.int({ min: 10000000, max: 99999999 }),
      rol: faker.helpers.arrayElement(['Profesor', 'Decano']),
      usuario: null,
      bonos: [],
      clases: [],
    };

    const nuevoUsuario: UsuarioEntity = await service.crearUsuario(usuario);
    expect(nuevoUsuario).not.toBeNull();

    const storedUsuario: UsuarioEntity = await repository.findOne({
      where: { id: nuevoUsuario.id },
    });
    expect(storedUsuario).not.toBeNull();
    expect(storedUsuario.nombre).toEqual(nuevoUsuario.nombre);
    expect(storedUsuario.numeroCedula).toEqual(nuevoUsuario.numeroCedula);
    expect(storedUsuario.grupoInvestigacion).toEqual(
      nuevoUsuario.grupoInvestigacion,
    );
    expect(storedUsuario.numeroExtension).toEqual(nuevoUsuario.numeroExtension);
    expect(storedUsuario.rol).toEqual(nuevoUsuario.rol);
  });

  // Crear usuario caso negativo:
  it('create should not allow a Decano/a con un número de extensión que no tenga 8 dígitos', async () => {
    const usuario: UsuarioEntity = {
      id: null,
      numeroCedula: faker.number.int({ min: 1000000000, max: 9999999999 }),
      nombre: faker.person.fullName(),
      grupoInvestigacion: faker.helpers.arrayElement([
        'TICSW',
        'IMAGINE',
        'COM',
      ]),
      // Número de extensión inválido
      numeroExtension: faker.number.int(10),
      rol: 'Decano',
      usuario: null,
      bonos: [],
      clases: [],
    };

    await expect(() => service.crearUsuario(usuario)).rejects.toHaveProperty(
      'message',
      'La extension del decano/a no es correcta',
    );
  });

  // Buscar usuario por id caso positivo:
  it('findUsuarioById should return a usuario by id', async () => {
    const storedUsuario: UsuarioEntity = usuariosList[0];
    const usuario: UsuarioEntity = await service.findUsuarioById(
      storedUsuario.id,
    );
    expect(usuario).not.toBeNull();
    expect(usuario.nombre).toEqual(storedUsuario.nombre);
    expect(usuario.numeroCedula).toEqual(storedUsuario.numeroCedula);
    expect(usuario.grupoInvestigacion).toEqual(
      storedUsuario.grupoInvestigacion,
    );
    expect(usuario.numeroExtension).toEqual(storedUsuario.numeroExtension);
    expect(usuario.rol).toEqual(storedUsuario.rol);
  });

  // Buscar usuario por id caso negativo:
  it('findUsuarioById should throw an exception for an invalid usuario', async () => {
    await expect(() => service.findUsuarioById(999999)).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  // Eliminar usuario caso positivo:
  it('deleteUsuario should remove a usuario', async () => {
    const usuario: UsuarioEntity = usuariosList[0];
    await service.eliminarUsuario(usuario.id);

    const deletedUsuario: UsuarioEntity = await repository.findOne({
      where: { id: usuario.id },
    });
    expect(deletedUsuario).toBeNull();
  });

  // Eliminar usuario caso negativo:
  it('delete should throw an exception for an invalid usuario', async () => {
    const museum: UsuarioEntity = usuariosList[0];
    await expect(() => service.eliminarUsuario(9999)).rejects.toHaveProperty(
      'message',
      'El usuario con el id dado no fue encontrado',
    );
  });
});
