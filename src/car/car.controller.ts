import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Pagination } from 'src/dtos/pagination.dto';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car } from './entities/car.entity';

@Controller('carro')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  create(@Body() createCarDto: CreateCarDto) {
    return this.carService.create(createCarDto);
  }

  @Get()
  findAllCars() {
    return this.carService.findAllCars();
  }

  @Get('/filter')
  async findAllFilterCorMarca(
    @Query('cor') cor?: string,
    @Query('marca') marca?: string,
  ): Promise<Car[]> {
    return this.carService.findAllFilterCorMarca(cor, marca);
  }

  @Get('/page')
  async findAllPage(
    @Query('cor') cor?: string,
    @Query('marca') marca?: string,
    @Query('size') size?: number,
    @Query('page') page?: number,
  ): Promise<Pagination<Car[]>> {
    return this.carService.findAllPage(cor, marca, size, page);
  }

  @Get('/disponivel')
  findAvailableCars() {
    return this.carService.findAvailableCars();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carService.findCarById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    return this.carService.update(+id, updateCarDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carService.remove(+id);
  }
}
