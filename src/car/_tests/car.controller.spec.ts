import { Test, TestingModule } from '@nestjs/testing';
import { carMock } from '../_mocks/car.mock';
import { CarController } from '../car.controller';
import { CarService } from '../car.service';
import { CreateCarDto } from '../dto/create-car.dto';

describe('CarController', () => {
  let controller: CarController;
  let carService: CarService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarController],
      providers: [
        CarService,
        {
          provide: CarService,
          useValue: {
            create: jest.fn().mockResolvedValue(carMock),
          },
        },
      ],
    }).compile();

    controller = module.get<CarController>(CarController);
    carService = module.get<CarService>(CarService);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
    expect(carService).toBeDefined();
  });

  describe('create', () => {
    it('deve chamar o método create do CarService com o CreateCarDto fornecido', async () => {
      const createCarDto: CreateCarDto = {
        cor: carMock.cor,
        marca: carMock.marca,
        placa: carMock.placa,
      };

      const createSpy = jest.spyOn(carService, 'create');

      await controller.create(createCarDto);

      expect(createSpy).toHaveBeenCalledWith(createCarDto);
    });

    it('deve retornar o resultado do método create do CarService', async () => {
      const createCarDto: CreateCarDto = {
        cor: carMock.cor,
        marca: carMock.marca,
        placa: carMock.placa,
      };

      const createResult = { id: 1, ...carMock }; // Supondo um resultado fictício

      jest.spyOn(carService, 'create').mockResolvedValue(carMock);

      const result = await controller.create(createCarDto);

      expect(result).toEqual(createResult);
    });
  });
});
