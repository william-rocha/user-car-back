import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { carMock } from '../_mocks/car.mock';

import { returnDeleteMock } from '../../_mocks/return-delete.mock';
import { CarService } from '../car.service';
import { UpdateCarDto } from '../dto/update-car.dto';
import { Car } from '../entities/car.entity';
import { StatusCar } from '../enums/car.enum';

describe('CarService', () => {
  let carService: CarService;
  let carRepository: Repository<Car>;

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
      ],
    }).compile();

    carService = module.get<CarService>(CarService);
    carRepository = module.get<Repository<Car>>(getRepositoryToken(Car));
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('deve estar definido, carRepository e carService', () => {
    expect(carRepository).toBeDefined();
    expect(carService).toBeDefined();
  });

  describe('create', () => {
    it('deve retornar produto apos inserido no db', async () => {
      const product = await carService.create(carMock);

      expect(product).toEqual(carMock);
    });
  });

  describe('findAllCars', () => {
    it('deve retornar uma array com todos Carros', async () => {
      jest.spyOn(carRepository, 'find').mockResolvedValue([carMock]);

      const resultado = await carService.findAllCars();

      expect(resultado).toEqual([carMock]);
    });
  });

  describe('findAllFilterCorMarca', () => {
    it('should find cars with filter by cor and marca', async () => {
      const cor = 'branco';
      const marca = 'Toyota';

      jest.spyOn(carRepository, 'find').mockResolvedValue([carMock]);

      const result = await carService.findAllFilterCorMarca(cor, marca);

      expect(result).toEqual([carMock]);

      expect(carRepository.find).toHaveBeenCalledWith({
        order: {
          createdAt: 'DESC',
        },
        where: {
          cor: ILike(`%${cor}%`),
          marca: ILike(`%${marca}%`),
        },
      });
    });
  });

  describe('findCarById', () => {
    it('deve encontrar um carro pelo ID', async () => {
      jest.spyOn(carRepository, 'findOne').mockResolvedValue(carMock);

      const result = await carService.findCarById(carMock.id);

      expect(result).toEqual(carMock);

      expect(carRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: carMock.id,
        },
      });
    });

    it('deve lançar NotFoundException quando o carro não é encontrado', async () => {
      const carId = 2;

      jest.spyOn(carRepository, 'findOne').mockResolvedValue(null);

      await expect(carService.findCarById(carId)).rejects.toThrowError(
        NotFoundException,
      );

      expect(carRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: carId,
        },
      });
    });
  });

  describe('update', () => {
    it('deve atualizar um carro com sucesso', async () => {
      const carId = 1;
      const updateCarDto: UpdateCarDto = {
        cor: 'azul',
        marca: 'Ford',
        // ... outros campos a serem atualizados
      };

      jest.spyOn(carService, 'findCarById').mockResolvedValue(carMock);

      jest.spyOn(carRepository, 'save').mockResolvedValue({
        ...carMock,
        ...updateCarDto,
      });

      const result = await carService.update(carId, updateCarDto);

      expect(result).toEqual({
        ...carMock,
        ...updateCarDto,
      });

      expect(carService.findCarById).toHaveBeenCalledWith(carId);

      expect(carRepository.save).toHaveBeenCalledWith({
        ...carMock,
        ...updateCarDto,
      });
    });
  });

  describe('remove', () => {
    it('deve remover um carro com sucesso', async () => {
      // jest.spyOn(carService, 'findCarById').mockResolvedValue(carMock);

      const deleteResult = await carService.remove(carMock.id);

      expect(deleteResult).toEqual(returnDeleteMock);

      // expect(carService.findCarById).toHaveBeenCalledWith(carMock.id);

      // expect(carRepository.softDelete).toHaveBeenCalledWith({ id: carMock.id });
    });

    it('deve lançar BadRequestException ao tentar remover um carro em uso', async () => {
      const carInUse: Car = {
        ...carMock,
        status: StatusCar.EM_USO,
      };

      jest.spyOn(carService, 'findCarById').mockResolvedValue(carInUse);

      await expect(carService.remove(carInUse.id)).rejects.toThrowError(
        BadRequestException,
      );

      expect(carService.findCarById).toHaveBeenCalledWith(carInUse.id);

      expect(carRepository.softDelete).not.toHaveBeenCalled();
    });
  });

  describe('findAvailableCars', () => {
    it('deve retornar carros disponíveis', async () => {
      const availableCars: Car[] = [carMock];

      jest.spyOn(carRepository, 'find').mockResolvedValue(availableCars);

      const result = await carService.findAvailableCars();

      expect(result).toEqual(availableCars);

      expect(carRepository.find).toHaveBeenCalledWith({
        where: {
          status: StatusCar.DISPONIVEL,
        },
      });
    });

    it('deve retornar uma lista vazia se não houver carros disponíveis', async () => {
      jest.spyOn(carRepository, 'find').mockResolvedValue([]);

      const result = await carService.findAvailableCars();

      expect(result).toEqual([]);

      expect(carRepository.find).toHaveBeenCalledWith({
        where: {
          status: StatusCar.DISPONIVEL,
        },
      });
    });
  });
});
