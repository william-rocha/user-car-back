import { Utilization } from 'src/utilization/entities/utilization.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StatusCar } from '../enums/car.enum';

@Entity()
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  placa: string;

  @Column()
  cor: string;

  @Column()
  marca: string;

  @Column({
    type: 'enum',
    enum: StatusCar,
    default: StatusCar.DISPONIVEL,
    name: 'status',
  })
  status: StatusCar;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Utilization, (utilization) => utilization.carro)
  utilizacoes?: Utilization[];
}
