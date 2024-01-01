import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, ILike, Repository } from 'typeorm';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car } from './entities/car.entity';
import { StatusCar } from './enums/car.enum';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
  ) {}

  async create(createCarDto: CreateCarDto): Promise<Car> {
    const car = this.carRepository.create(createCarDto);
    return this.carRepository.save({ ...car });
  }

  async findAllCars(): Promise<Car[]> {
    const cars = await this.carRepository.find();
    return cars;
  }

  async findAllFilterCorMarca(cor: string, marca: string): Promise<Car[]> {
    const carFilter = await this.carRepository.find({
      order: {
        createdAt: 'DESC',
      },
      where: {
        cor: ILike(`%${cor}%`),
        marca: ILike(`%${marca}%`),
      },
    });
    return carFilter;
  }

  async findCarById(carId: number): Promise<Car> {
    const car = await this.carRepository.findOne({
      where: {
        id: carId,
      },
    });

    if (!car) {
      throw new NotFoundException(`CarroId: ${carId} não encontrado.`);
    }

    return car;
  }

  async update(id: number, updateCar: UpdateCarDto): Promise<Car> {
    const car = await this.findCarById(id);

    return this.carRepository.save({
      ...car,
      ...updateCar,
    });
  }

  async remove(carId: number): Promise<DeleteResult> {
    const car = await this.findCarById(carId);
    if (car.status == StatusCar.EM_USO) {
      throw new BadRequestException(
        'Para deletar um Carro que esta em uso de carro deve se primeiro finalizar o registro em "Veículos em Uso"',
      );
    }

    return this.carRepository.softDelete({ id: carId });
  }

  async findAvailableCars(): Promise<Car[]> {
    const cars = await this.carRepository.find({
      where: {
        status: StatusCar.DISPONIVEL,
      },
    });

    return cars;
  }

  // async findAllPage(
  //   cor?: string,
  //   marca?: string,
  //   size?: number,
  //   page?: number,
  // ): Promise<Pagination<Car[]>> {
  //   size = Number(size) || this.SIZE;
  //   page = Number(page) || this.PAGE;

  //   const [cars, total] = await this.carRepository.findAndCount({
  //     order: {
  //       createdAt: 'DESC',
  //     },
  //     where: {
  //       cor: ILike(`%${cor}%`),
  //       marca: ILike(`%${marca}%`),
  //     },
  //     skip: (page - 1) * size,
  //     take: size,
  //   });

  //   return new Pagination(
  //     new PaginationMeta(
  //       Number(size),
  //       total,
  //       Number(page),
  //       Math.ceil(total / size),
  //     ),
  //     cars,
  //   );
  // }
}
