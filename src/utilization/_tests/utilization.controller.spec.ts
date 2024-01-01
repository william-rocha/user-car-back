import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { carMock } from '../../_mocks/car.mock';
import { returnDeleteMock } from '../../_mocks/return-delete.mock';
import { CarService } from '../../car/car.service';
import { Car } from '../../car/entities/car.entity';
import { driverMock } from '../../driver/_mocks/driver.mock';
import { DriverService } from '../../driver/driver.service';
import { Driver } from '../../driver/entities/driver.entity';
import { utilizationMock } from '../_mocks/utilization.mock';
import { Utilization } from '../entities/utilization.entity';
import { UtilizationController } from '../utilization.controller';
import { UtilizationService } from '../utilization.service';

describe('UtilizationController', () => {
  let controller: UtilizationController;
  let service: UtilizationService;
  let carService: CarService;

  let driverService: DriverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UtilizationController],
      providers: [
        CarService,
        {
          provide: getRepositoryToken(Car),
          useValue: {
            find: jest.fn().mockResolvedValue([carMock]),
            findById: jest.fn().mockResolvedValue(carMock),
            create: jest.fn().mockResolvedValue(carMock),
            findOne: jest.fn().mockResolvedValue(carMock),
            save: jest.fn().mockResolvedValue(carMock),
            softDelete: jest.fn().mockResolvedValue(returnDeleteMock),
          },
        },
        DriverService,
        {
          provide: getRepositoryToken(Driver),
          useValue: {
            find: jest.fn().mockResolvedValue([driverMock]),
            findById: jest.fn().mockResolvedValue(driverMock),
            create: jest.fn().mockResolvedValue(driverMock),
            findOne: jest.fn().mockResolvedValue(driverMock),
            save: jest.fn().mockResolvedValue(driverMock),
          },
        },
        UtilizationService,
        {
          provide: getRepositoryToken(Utilization),
          useValue: {
            find: jest.fn().mockResolvedValue([utilizationMock]),
            findById: jest.fn().mockResolvedValue(utilizationMock),
            create: jest.fn().mockResolvedValue(utilizationMock),
            findOne: jest.fn().mockResolvedValue(utilizationMock),
            save: jest.fn().mockResolvedValue(utilizationMock),
          },
        },
      ],
    }).compile();

    service = module.get<UtilizationService>(UtilizationService);
    controller = module.get<UtilizationController>(UtilizationController);
    carService = module.get<CarService>(CarService);
    driverService = module.get<DriverService>(DriverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
    expect(carService).toBeDefined();
    expect(driverService).toBeDefined();
  });
});
