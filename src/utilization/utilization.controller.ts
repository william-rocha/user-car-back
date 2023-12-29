import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUtilizationDto } from './dto/create-utilization.dto';
import { UpdateUtilizationDto } from './dto/update-utilization.dto';
import { UtilizationService } from './utilization.service';

@Controller('carro-usuario')
export class UtilizationController {
  constructor(private readonly utilizationService: UtilizationService) {}

  @Post()
  createUtilization(@Body() createUtilizationDto: CreateUtilizationDto) {
    return this.utilizationService.createUtilization(createUtilizationDto);
  }

  @Get()
  findAll() {
    return this.utilizationService.findAll();
  }

  @Get(':id')
  findUserCarById(@Param('id') id: string) {
    return this.utilizationService.findUserCarById(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUtilizationDto: UpdateUtilizationDto,
  ) {
    return this.utilizationService.update(+id, updateUtilizationDto);
  }
  @Patch('finalizar/:id')
  endUtilization(@Param('id') id: string) {
    return this.utilizationService.endUtilization(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.utilizationService.remove(+id);
  }
}
