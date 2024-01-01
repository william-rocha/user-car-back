import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Utilization } from '../../utilization/entities/utilization.entity';
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

  @DeleteDateColumn()
  public deletedAt: Date;
}
