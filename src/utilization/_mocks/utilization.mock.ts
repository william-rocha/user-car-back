import { carMock } from '../../_mocks/car.mock';
import { driverMock } from '../../driver/_mocks/driver.mock';
import { CreateUtilizationDto } from '../dto/create-utilization.dto';
import { Utilization } from '../entities/utilization.entity';
import { Status } from '../enum/status.enum';

export const utilizationMock: Utilization = {
  motivoUtilizacao: 'Viagem de negócios',
  motorista: driverMock,
  carro: carMock,
  dataTermino: null,
  id: 3,
  dataInicio: new Date('2023-12-29T14:08:16.242Z'),
  status: Status.RODANDO,
};

export const utilizationMockCreate: CreateUtilizationDto = {
  motivoUtilizacao: utilizationMock.motivoUtilizacao,
  driverId: driverMock.id,
  carId: carMock.id,
};
