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

import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { Driver } from './entities/driver.entity';

@Controller('motorista')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post()
  create(@Body() createDriverDto: CreateDriverDto) {
    return this.driverService.create(createDriverDto);
  }

  @Get()
  findAllDrivers() {
    return this.driverService.findAllDrivers();
  }

  @Get('/filter')
  async findAllFilterName(@Query('nome') nome?: string): Promise<Driver[]> {
    return this.driverService.findAllFilterName(nome);
  }

  @Get('/disponivel')
  findAvailableCars() {
    return this.driverService.findAvailableDrivers();
  }

  @Get(':id')
  findDriverById(@Param('id') id: string) {
    return this.driverService.findDriverById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDriverDto: UpdateDriverDto) {
    return this.driverService.update(+id, updateDriverDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.driverService.remove(+id);
  }
}
