import { Car } from '../car/entities/car.entity';
import { StatusCar } from '../car/enums/car.enum';

export const carMock: Car = {
  id: 3,
  placa: 'ABC1234',
  cor: 'branco',
  marca: 'Toyota',
  status: StatusCar.DISPONIVEL,
  createdAt: new Date('2023-12-31T00:27:26.365Z'),
  deletedAt: new Date('2023-12-31T00:27:26.365Z'),
};
