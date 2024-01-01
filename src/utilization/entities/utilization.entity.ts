import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Car } from '../../car/entities/car.entity';
import { Driver } from '../../driver/entities/driver.entity';
import { Status } from '../enum/status.enum';

@Entity()
export class Utilization {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'data_inicio' })
  dataInicio: Date;

  @Column({ name: 'data_termino', nullable: true })
  dataTermino: Date;

  @Column({ name: 'motivo_utilizacao' })
  motivoUtilizacao: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.RODANDO,
    name: 'status',
  })
  status: Status;

  @ManyToOne(() => Driver, (motorista) => motorista.utilizacoes, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn({ name: 'motorista_id', referencedColumnName: 'id' })
  motorista?: Driver;

  @ManyToOne(() => Car, (carro) => carro.utilizacoes, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn({ name: 'carro_id', referencedColumnName: 'id' })
  carro?: Car;
}
