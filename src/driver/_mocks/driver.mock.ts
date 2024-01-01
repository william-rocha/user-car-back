import { CreateDriverDto } from '../dto/create-driver.dto';
import { Driver } from '../entities/driver.entity';
import { StatusDriver } from '../enum/status.enum';

export const driverMock: Driver = {
  id: 1,
  nome: 'João da Silva',
  status: StatusDriver.DISPONIVEL,
  createdAt: new Date('2023-12-29T14:02:12.136Z'),
  updatedAt: new Date('2023-12-29T14:02:12.136Z'),
  deletedAt: undefined,
};

export const driverMockCreate: CreateDriverDto = {
  nome: 'João da Silva',
};
