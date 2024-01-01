import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Utilization } from '../../utilization/entities/utilization.entity';
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

  @DeleteDateColumn()
  public deletedAt: Date;
}
