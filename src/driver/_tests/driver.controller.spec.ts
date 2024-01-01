import { Test, TestingModule } from '@nestjs/testing';
import { driverMock, driverMockCreate } from '../_mocks/driver.mock';
import { DriverController } from '../driver.controller';
import { DriverService } from '../driver.service';

describe('DriverController', () => {
  let controller: DriverController;
  let driverService: DriverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriverController],
      providers: [
        DriverService,
        {
          provide: DriverService,
          useValue: {
            create: jest.fn().mockResolvedValue(driverMock),
          },
        },
      ],
    }).compile();

    controller = module.get<DriverController>(DriverController);
    driverService = module.get<DriverService>(DriverService);
  });

  it('deve ser definido, driverController', () => {
    expect(controller).toBeDefined();
    expect(driverService).toBeDefined();
  });

  describe('create', () => {
    it('deve chamar o método create do DriverService com o CreateDriverDto fornecido', async () => {
      const createSpy = jest.spyOn(driverService, 'create');

      await controller.create(driverMockCreate);

      expect(createSpy).toHaveBeenCalledWith(driverMockCreate);
    });

    it('deve retornar o resultado do método create do DriverService', async () => {
      jest.spyOn(driverService, 'create').mockResolvedValue(driverMock);

      const result = await controller.create(driverMockCreate);

      expect(result).toEqual(driverMock);
    });
  });
});
