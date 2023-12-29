import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination, PaginationMeta } from 'src/dtos/pagination.dto';
import { DeleteResult, Like, Repository } from 'typeorm';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { Driver } from './entities/driver.entity';
import { StatusDriver } from './enum/status.enum';

@Injectable()
export class DriverService {
  SIZE = 10;
  PAGE = 1;
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
  ) {}

  async create(createDriverDto: CreateDriverDto): Promise<Driver> {
    const driver = this.driverRepository.create(createDriverDto);
    return this.driverRepository.save({ ...driver });
  }

  async findAllDrivers(): Promise<Driver[]> {
    const drivers = await this.driverRepository.find();

    if (!drivers) {
      throw new NotFoundException('Motoristas não encontrados');
    }
    return drivers;
  }

  async findAvailableDrivers(): Promise<Driver[]> {
    const drivers = await this.driverRepository.find({
      where: {
        status: StatusDriver.DISPONIVEL,
      },
    });

    return drivers;
  }

  async findAllPageFilter(
    nome?: string,
    size?: number,
    page?: number,
  ): Promise<Pagination<Driver[]>> {
    size = Number(size) || this.SIZE;
    page = Number(page) || this.PAGE;

    const [drivers, total] = await this.driverRepository.findAndCount({
      order: {
        createdAt: 'DESC',
      },
      where: {
        nome: Like(`%${nome}%`),
      },
      skip: (page - 1) * size,
      take: size,
    });

    return new Pagination(
      new PaginationMeta(
        Number(size),
        total,
        Number(page),
        Math.ceil(total / size),
      ),
      drivers,
    );
  }

  async findDriverById(driverId: number): Promise<Driver> {
    const driver = await this.driverRepository.findOne({
      where: {
        id: driverId,
      },
    });
    if (!driver) {
      throw new NotFoundException(`motoristaId: ${driverId} não encontrado`);
    }
    return driver;
  }

  async update(id: number, updateDriver: UpdateDriverDto): Promise<Driver> {
    const driver = await this.findDriverById(id);

    return this.driverRepository.save({
      ...driver,
      ...updateDriver,
    });
  }

  async updateCurrentUtilization(driverId: number): Promise<void> {
    const car = await this.driverRepository.findOne({
      where: {
        id: driverId,
      },
      relations: ['utilizacoes'],
    });
    if (car) {
      await this.driverRepository.save(car);
    }
  }

  async remove(driverId: number): Promise<DeleteResult> {
    const driver = await this.findDriverById(driverId);
    if (driver.status == StatusDriver.EM_USO) {
      throw new BadRequestException(
        'Para deletar um motorista que esta em uso de carro deve finalizar primeiro o registro em "Veículos em Uso"',
      );
    }
    return this.driverRepository.delete({ id: driver.id });
  }
}
