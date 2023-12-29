import { Utilization } from 'src/utilization/entities/utilization.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StatusDriver } from '../enum/status.enum';

@Entity()
export class Driver {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({
    type: 'enum',
    enum: StatusDriver,
    default: StatusDriver.DISPONIVEL,
    name: 'status',
  })
  status: StatusDriver;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Utilization, (utilization) => utilization.motorista)
  utilizacoes?: Utilization[];
}
