import { Test, TestingModule } from '@nestjs/testing';
import { ClaseService } from './clase.service';
import { ClaseEntity } from './clase.entity/clase.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker/.';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('ClaseService', () => {
  let service: ClaseService;
  let repository: Repository<ClaseEntity>;
  let clase: ClaseEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClaseService],
    }).compile();

    service = module.get<ClaseService>(ClaseService);

    repository = module.get<Repository<ClaseEntity>>(
      getRepositoryToken(ClaseEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    clase = await repository.save({
      nombre: faker.lorem.word(),
      codigo: faker.string.alphanumeric(10),
      numeroCreditos: faker.number.int({ min: 2, max: 4 }),
    });
  };

  // Crear una clase caso de prueba positivo:
  it('crearClase debe crear una clase', async () => {
    const claseNew: ClaseEntity = {
      id: 1,
      nombre: faker.lorem.word(),
      codigo: faker.string.alphanumeric(10),
      numeroCreditos: faker.number.int({ min: 2, max: 4 }),
      usuario: null,
      bonos: [],
    };

    const claseCreated = await service.crearClase(claseNew);
    expect(claseCreated).not.toBeNull();
    const claseEncontrada = await repository.findOne({
      where: { id: claseCreated.id },
    });
    expect(claseEncontrada).not.toBeNull();
    expect(claseEncontrada.nombre).toEqual(claseNew.nombre);
  });

  // Crear una clase caso de prueba negativo:
  it('crearClase no debe crear una clase con datos erroneos', async () => {
    const claseNew: ClaseEntity = {
      id: 1,
      nombre: faker.lorem.word(),
      // Un codigo demasiado largo:
      codigo: faker.string.alphanumeric(11),
      numeroCreditos: faker.number.int({ min: 2, max: 4 }),
      usuario: null,
      bonos: [],
    };
    await expect(service.crearClase(claseNew)).rejects.toHaveProperty(
      'message',
      'El código de la clase debe tener exactamente 10 caracteres',
    );
  });

  // Buscar una clase por id caso de prueba positivo:
  it('findClaseById debe encontrar una clase por su id', async () => {
    const claseEncontrada = await service.findClaseById(clase.id);
    expect(claseEncontrada).not.toBeNull();
    expect(claseEncontrada.nombre).toEqual(clase.nombre);
    expect(claseEncontrada.codigo).toEqual(clase.codigo);
    expect(claseEncontrada.numeroCreditos).toEqual(clase.numeroCreditos);
  });

  // Buscar una clase por id caso de prueba negativo:
  it('findClaseById no debe encontrar una clase por su id', async () => {
    await expect(service.findClaseById(999)).rejects.toHaveProperty(
      'message',
      'La clase con el id dado no fue encontrada',
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
