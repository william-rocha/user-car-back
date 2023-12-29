import { Test, TestingModule } from '@nestjs/testing';
import { UtilizationController } from './utilization.controller';
import { UtilizationService } from './utilization.service';

describe('UtilizationController', () => {
  let controller: UtilizationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UtilizationController],
      providers: [UtilizationService],
    }).compile();

    controller = module.get<UtilizationController>(UtilizationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
