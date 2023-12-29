import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarModule } from 'src/car/car.module';
import { DriverModule } from 'src/driver/driver.module';
import { Utilization } from './entities/utilization.entity';
import { UtilizationController } from './utilization.controller';
import { UtilizationService } from './utilization.service';

@Module({
  imports: [TypeOrmModule.forFeature([Utilization]), CarModule, DriverModule],
  controllers: [UtilizationController],
  providers: [UtilizationService],
})
export class UtilizationModule {}
