import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DeleteResult, Like, Repository } from 'typeorm';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { Driver } from './entities/driver.entity';
import { StatusDriver } from './enum/status.enum';

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
  ) {}

  async create(createDriverDto: CreateDriverDto): Promise<Driver> {
    const driver = this.driverRepository.create(createDriverDto);
    return await this.driverRepository.save({ ...driver });
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

  async findAllFilterName(nome?: string): Promise<Driver[]> {
    const driverFiltered = await this.driverRepository.find({
      order: {
        createdAt: 'DESC',
      },
      where: {
        nome: Like(`%${nome}%`),
      },
    });

    return driverFiltered;
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

  async remove(driverId: number): Promise<DeleteResult> {
    const driver = await this.findDriverById(driverId);
    if (driver.status == StatusDriver.EM_USO) {
      throw new BadRequestException(
        'Para excluir um motorista que está atualmente utilizando um veículo, é necessário primeiro encerrar o registro no módulo "Veículos em Uso".',
      );
    }
    return this.driverRepository.softDelete({ id: driver.id });
  }
}
