import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarModule } from './car/car.module';
import { DriverModule } from './driver/driver.module';
import { UtilizationModule } from './utilization/utilization.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.dev'],
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: process.env.DB_DATABASE,
      host: process.env.DB_HOST,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      entities: [`${__dirname}/**/*.entity{.js,.ts}`],
      synchronize: true,
      // migrations: [`${__dirname}/migration/{.ts,*.js}`],
      // migrationsRun: true,
    }),
    DriverModule,
    CarModule,
    UtilizationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
