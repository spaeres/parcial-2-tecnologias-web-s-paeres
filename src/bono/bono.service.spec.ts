import { Test, TestingModule } from '@nestjs/testing';
import { BonoService } from './bono.service';
import { Repository } from 'typeorm';
import { BonoEntity } from './bono.entity/bono.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { UsuarioEntity } from '../usuario/usuario.entity/usuario.entity';
import { ClaseEntity } from '../clase/clase.entity/clase.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('BonoService', () => {
  let service: BonoService;
  let repositoryBono: Repository<BonoEntity>;
  let repositoryClase: Repository<ClaseEntity>;
  let repositoryUsuario: Repository<UsuarioEntity>;
  let bonoList: BonoEntity[];
  let usuarioProfesor: UsuarioEntity;
  let usuarioDecano: UsuarioEntity;
  let clase: ClaseEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [BonoService],
    }).compile();

    service = module.get<BonoService>(BonoService);

    repositoryBono = module.get<Repository<BonoEntity>>(
      getRepositoryToken(BonoEntity),
    );

    repositoryUsuario = module.get<Repository<UsuarioEntity>>(
      getRepositoryToken(UsuarioEntity),
    );

    repositoryClase = module.get<Repository<ClaseEntity>>(
      getRepositoryToken(ClaseEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repositoryBono.clear();
    await repositoryUsuario.clear();
    await repositoryClase.clear();
    bonoList = [];
    for (let i = 0; i < 5; i++) {
      const bono: BonoEntity = await repositoryBono.save({
        monto: faker.number.int({ min: 1000, max: 100000 }),
        calificacion: faker.number.float({ min: 0, max: 5 }),
        palabraClave: faker.string.alphanumeric(10),
      });
      bonoList.push(bono);
    }

    usuarioProfesor = await repositoryUsuario.save({
      numeroCedula: faker.number.int({ min: 10000000, max: 99999999 }),
      nombre: faker.person.fullName(),
      grupoInvestigacion: faker.helpers.arrayElement([
        'TICSW',
        'IMAGINE',
        'COMIT',
      ]),
      numeroExtension: faker.number.int({ min: 1, max: 99 }),
      rol: 'Profesor',
      bonos: bonoList,
      clases: [],
    });

    usuarioDecano = await repositoryUsuario.save({
      numeroCedula: faker.number.int({ min: 10000000, max: 99999999 }),
      nombre: faker.person.fullName(),
      grupoInvestigacion: faker.helpers.arrayElement([
        'TICSW',
        'IMAGINE',
        'COMIT',
      ]),
      numeroExtension: faker.number.int({ min: 1, max: 99 }),
      rol: 'Decano',
      bonos: [],
      clases: [],
    });

    clase = await repositoryClase.save({
      codigo: faker.string.alphanumeric(10),
      nombre: faker.helpers.arrayElement([
        'Cálculo',
        'Física',
        'Programación',
        'Base de Datos',
        'Redes',
      ]),
      salon: faker.location.buildingNumber(),
      horario: faker.lorem.sentence(),
      usuario: usuarioProfesor,
      numeroCreditos: faker.number.int({ min: 2, max: 4 }),
      bonos: bonoList,
    });
  };

  // Caso negativo crear:
  it('create should throw an error when monto is invalid or user is not a Profesor', async () => {
    // Bono invalido:
    const bono: BonoEntity = {
      id: null,
      monto: -100,
      calificacion: faker.number.float({ min: 0, max: 5 }),
      palabraClave: faker.string.alphanumeric(10),
      usuario: usuarioProfesor,
      clase: clase,
    };

    await expect(
      service.createBono(bono, usuarioProfesor.id),
    ).rejects.toHaveProperty(
      'message',
      'El monto debe ser un valor positivo y no puede estar vacio',
    );

    // Bono invalido 2:
    bono.monto = 500;
    bono.usuario = usuarioDecano;
    await expect(
      service.createBono(bono, usuarioDecano.id),
    ).rejects.toHaveProperty(
      'message',
      'Solo un usuario con rol Profesor puede crear un bono',
    );
  });

  // Caso positivo crear:
  it('create should return a new Bono', async () => {
    const bono: BonoEntity = {
      id: 1,
      monto: 100,
      calificacion: faker.number.float({ min: 0, max: 5 }),
      palabraClave: faker.string.alphanumeric(10),
      usuario: usuarioProfesor,
      clase: clase,
    };

    const newBono: BonoEntity = await service.createBono(
      bono,
      usuarioProfesor.id,
    );
    expect(newBono).not.toBeNull();

    const storedAlbum: BonoEntity = await repositoryBono.findOne({
      where: { id: newBono.id },
    });
    expect(storedAlbum).not.toBeNull();
    expect(storedAlbum.monto).toEqual(newBono.monto);
    expect(storedAlbum.calificacion).toEqual(newBono.calificacion);
    expect(storedAlbum.palabraClave).toEqual(newBono.palabraClave);
  });

  // Caso positivo buscar por codigo:
  it('findBonosByCodigo should return all Bonos of a Clase by its code', async () => {
    const bonos: BonoEntity[] = await service.findBonosByCodigo(clase.codigo);
    expect(bonos).not.toBeNull();
    expect(bonos.length).toEqual(5);
  });

  // Caso negativo buscar por codigo:
  it('findBonosByCodigo should throw an exception for an invalid Clase', async () => {
    await expect(
      service.findBonosByCodigo('no-existent-code'),
    ).rejects.toHaveProperty(
      'message',
      'No se encontraron bonos con el código de clase especificado',
    );
  });

  // Caso positivo buscar por id de usuario:
  it('findBonosByUsuarioId should return all Bonos of a Usuario by its id', async () => {
    const bonos: BonoEntity[] = await service.findAllBonosByUsuario(
      usuarioProfesor.id,
    );
    expect(bonos).not.toBeNull();
    expect(bonos.length).toEqual(5);
    bonos.forEach((bono) => {
      expect(bono.usuario.id).toEqual(usuarioProfesor.id);
    });
  });

  // Caso negativo: Buscar bonos por un ID de usuario inválido
  it('findBonosByUsuarioId should throw an exception for an invalid Usuario', async () => {
    const idInexistente = 99999999;
    await expect(
      service.findAllBonosByUsuario(idInexistente),
    ).rejects.toHaveProperty(
      'message',
      'No se encontraron bonos para el usuario con ID ' + idInexistente,
    );
  });

  // Caso positivo borrar:
  it('deleteBono should remove a bono', async () => {
    const bono: BonoEntity = await repositoryBono.save({
      monto: faker.number.int({ min: 1000, max: 100000 }),
      // Se deja como maximo 4 para que el bono sea valido para ser borrado siempre:
      calificacion: faker.number.float({ min: 0, max: 4 }),
      palabraClave: faker.string.alphanumeric(10),
    });

    let storedBono = await repositoryBono.findOne({ where: { id: bono.id } });
    expect(storedBono).not.toBeNull();

    await service.deleteBono(bono.id);

    storedBono = await repositoryBono.findOne({ where: { id: bono.id } });
    expect(storedBono).toBeNull();
  });

  // Caso negativo borrar:
  it('deleteBono should not remove a bono that does not exist', async () => {
    await expect(service.deleteBono(999999999)).rejects.toHaveProperty(
      'message',
      'El bono con el id dado no fue encontrado',
    );
  });
});
