import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { carMock } from '../../_mocks/car.mock';
import { returnDeleteMock } from '../../_mocks/return-delete.mock';
import { CarService } from '../../car/car.service';
import { Car } from '../../car/entities/car.entity';
import { StatusCar } from '../../car/enums/car.enum';
import { driverMock } from '../../driver/_mocks/driver.mock';
import { DriverService } from '../../driver/driver.service';
import { Driver } from '../../driver/entities/driver.entity';
import { StatusDriver } from '../../driver/enum/status.enum';

import {
  utilizationMock,
  utilizationMockCreate,
} from '../_mocks/utilization.mock';
import { Utilization } from '../entities/utilization.entity';
import { UtilizationService } from '../utilization.service';

describe('UtilizationService', () => {
  let service: UtilizationService;
  let repository: Repository<Utilization>;
  let carService: CarService;
  let carRepository: Repository<Car>;
  let driverService: DriverService;
  let driverRepository: Repository<Driver>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    repository = module.get<Repository<Utilization>>(
      getRepositoryToken(Utilization),
    );
    carService = module.get<CarService>(CarService);
    carRepository = module.get<Repository<Car>>(getRepositoryToken(Car));

    driverService = module.get<DriverService>(DriverService);
    driverRepository = module.get<Repository<Driver>>(
      getRepositoryToken(Driver),
    );
  });

  it('espera que seja defindo, service e repository de; utilization, driver e car', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(carService).toBeDefined();
    expect(carRepository).toBeDefined();
    expect(driverService).toBeDefined();
    expect(driverRepository).toBeDefined();
  });

  describe('createUtilization', () => {
    it('deve criar uma utilização com sucesso', async () => {
      jest.spyOn(driverService, 'findDriverById').mockResolvedValue(driverMock);
      jest.spyOn(carService, 'findCarById').mockResolvedValue(carMock);
      jest.spyOn(service, 'isCarInUse').mockResolvedValue(false);
      jest.spyOn(service, 'driverAlreadyUsingCar').mockResolvedValue(false);

      jest.spyOn(repository, 'create').mockReturnValue(utilizationMock);
      jest.spyOn(repository, 'save').mockResolvedValue(utilizationMock);

      const result = await service.createUtilization(utilizationMockCreate);

      expect(result).toEqual(utilizationMock);

      expect(driverService.findDriverById).toHaveBeenCalledWith(
        utilizationMockCreate.driverId,
      );
      expect(carService.findCarById).toHaveBeenCalledWith(
        utilizationMockCreate.carId,
      );
      expect(service.isCarInUse).toHaveBeenCalledWith(
        utilizationMockCreate.carId,
      );
      expect(service.driverAlreadyUsingCar).toHaveBeenCalledWith(
        utilizationMockCreate.driverId,
      );
      expect(repository.create).toHaveBeenCalledWith({
        ...utilizationMockCreate,
        motorista: driverMock,
        carro: carMock,
      });
      expect(repository.save).toHaveBeenCalledWith(utilizationMock);
    });

    it('deve lançar BadRequestException ao tentar criar uma utilização com carro em uso', async () => {
      const carMock_emUso = {
        ...carMock,
        status: StatusCar.EM_USO,
      };

      jest.spyOn(driverService, 'findDriverById').mockResolvedValue(driverMock);
      jest.spyOn(carService, 'findCarById').mockResolvedValue(carMock_emUso);
      jest.spyOn(service, 'isCarInUse').mockResolvedValue(true);

      await expect(
        service.createUtilization(utilizationMockCreate),
      ).rejects.toThrowError(BadRequestException);

      expect(driverService.findDriverById).toHaveBeenCalledWith(
        utilizationMockCreate.driverId,
      );
      expect(carService.findCarById).toHaveBeenCalledWith(
        utilizationMockCreate.carId,
      );
      expect(service.isCarInUse).toHaveBeenCalledWith(
        utilizationMockCreate.carId,
      );

      const driverAlreadyUsingCarSpy = jest
        .spyOn(service, 'driverAlreadyUsingCar')
        .mockResolvedValue(true);

      expect(driverAlreadyUsingCarSpy).not.toHaveBeenCalledWith(
        utilizationMockCreate.carId,
      );
      expect(repository.create).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('deve lançar BadRequestException ao tentar criar uma utilização com motorista já utilizando carro', async () => {
      const driverMock_emUso = {
        ...driverMock,
        status: StatusDriver.EM_USO,
      };

      jest
        .spyOn(driverService, 'findDriverById')
        .mockResolvedValue(driverMock_emUso);
      jest.spyOn(carService, 'findCarById').mockResolvedValue(carMock);
      jest.spyOn(service, 'isCarInUse').mockResolvedValue(false);
      jest.spyOn(service, 'driverAlreadyUsingCar').mockResolvedValue(true);

      await expect(
        service.createUtilization(utilizationMockCreate),
      ).rejects.toThrowError(BadRequestException);

      expect(driverService.findDriverById).toHaveBeenCalledWith(
        utilizationMockCreate.driverId,
      );
      expect(carService.findCarById).toHaveBeenCalledWith(
        utilizationMockCreate.carId,
      );
      expect(service.isCarInUse).toHaveBeenCalledWith(
        utilizationMockCreate.carId,
      );
      expect(service.driverAlreadyUsingCar).toHaveBeenCalledWith(
        utilizationMockCreate.driverId,
      );
      expect(repository.create).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });
  });
});
