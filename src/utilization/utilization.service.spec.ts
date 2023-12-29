import { Test, TestingModule } from '@nestjs/testing';
import { UtilizationService } from './utilization.service';

describe('UtilizationService', () => {
  let service: UtilizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UtilizationService],
    }).compile();

    service = module.get<UtilizationService>(UtilizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
