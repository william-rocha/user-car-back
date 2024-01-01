// utilization.service.ts

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DeleteResult, Repository } from 'typeorm';
import { CarService } from '../car/car.service';
import { StatusCar } from '../car/enums/car.enum';
import { DriverService } from '../driver/driver.service';
import { StatusDriver } from '../driver/enum/status.enum';
import { CreateUtilizationDto } from './dto/create-utilization.dto';
import { Utilization } from './entities/utilization.entity';
import { Status } from './enum/status.enum';

@Injectable()
export class UtilizationService {
  constructor(
    @InjectRepository(Utilization)
    private readonly utilizationRepository: Repository<Utilization>,
    private readonly carService: CarService,
    private readonly driverService: DriverService,
  ) {}

  async findAll(): Promise<Utilization[]> {
    return this.utilizationRepository.find({
      relations: {
        carro: true,
        motorista: true,
      },
      withDeleted: true,
    });
  }

  async createUtilization(
    createUtilization: CreateUtilizationDto,
  ): Promise<Utilization> {
    const motorista = await this.driverService.findDriverById(
      createUtilization.driverId,
    );

    const carro = await this.carService.findCarById(createUtilization.carId);

    const isCarInUse = await this.isCarInUse(createUtilization.carId);

    if (isCarInUse) {
      throw new BadRequestException(
        `Este Carro com id: ${carro.id} já está sendo utilizado por outro motorista`,
      );
    }

    const isDriverInUse = await this.driverAlreadyUsingCar(
      createUtilization.driverId,
    );

    if (isDriverInUse) {
      throw new BadRequestException(`Este Carro já está utilizado um Carro`);
    }
    motorista.status = StatusDriver.EM_USO;
    carro.status = StatusCar.EM_USO;

    const utilization = this.utilizationRepository.create({
      ...createUtilization,
      motorista,
      carro,
    });

    const userSave = await this.utilizationRepository.save(utilization);

    return userSave;
  }

  async endUtilization(useCarId: number): Promise<void> {
    const utilization = await this.findUtilizationById(useCarId);

    const carro = await this.carService.findCarById(utilization.carro.id);

    const motorista = await this.driverService.findDriverById(
      utilization.motorista.id,
    );

    motorista.status = StatusDriver.DISPONIVEL;
    carro.status = StatusCar.DISPONIVEL;

    if (!utilization) {
      throw new NotFoundException('Utilização não encontrada');
    }

    if (utilization.dataTermino) {
      throw new Error('Esta utilização já foi finalizada');
    }

    utilization.dataTermino = new Date();

    await this.utilizationRepository.save({
      ...utilization,
      status: Status.FINALIZADA,
      motorista,
      carro,
      relations: {
        carro: true,
        motorista: true,
      },
    });
  }

  async isCarInUse(carId: number): Promise<boolean> {
    const inUse = await this.utilizationRepository.findOne({
      where: {
        carro: { id: carId },
        status: Status.RODANDO,
      },
    });

    return !!inUse;
  }

  async driverAlreadyUsingCar(driverId: number): Promise<boolean> {
    const inUse = await this.utilizationRepository.findOne({
      where: {
        motorista: { id: driverId },
        status: Status.RODANDO,
      },
    });

    return !!inUse;
  }

  async findActiveUtilization(
    driverId: number,
    carPlaca: string,
  ): Promise<Utilization | null> {
    const utilization = await this.utilizationRepository.findOne({
      where: {
        motorista: { id: driverId },
        carro: { placa: carPlaca },
        dataTermino: null,
      },
    });

    return utilization || null;
  }

  async findUtilizationById(userId: number) {
    const driver = await this.utilizationRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        carro: true,
        motorista: true,
      },
    });
    if (!driver) {
      throw new NotFoundException(
        `Esta relação de uso userId: ${userId} não foi encontrado`,
      );
    }
    return driver;
  }

  async remove(userId: number): Promise<DeleteResult> {
    await this.findUtilizationById(userId);

    return await this.utilizationRepository.delete({ id: userId });
  }
}
