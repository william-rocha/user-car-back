import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { driverMock, driverMockCreate } from '../_mocks/driver.mock';
import { DriverService } from '../driver.service';
import { Driver } from '../entities/driver.entity';

describe('DriverService', () => {
  let driverService: DriverService;
  let driverRepository: Repository<Driver>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DriverService,
        {
          provide: getRepositoryToken(Driver),
          useValue: {
            find: jest.fn().mockResolvedValue([driverMock]),
            findById: jest.fn().mockResolvedValue(driverMock),
            create: jest.fn().mockResolvedValue(driverMock),
            findOne: jest.fn().mockResolvedValue(driverMock),
            save: jest.fn().mockResolvedValue(driverMock),
          },
        },
      ],
    }).compile();

    driverService = module.get<DriverService>(DriverService);
    driverRepository = module.get<Repository<Driver>>(
      getRepositoryToken(Driver),
    );
  });

  it('deve ser definido, driverRepository e driverService', () => {
    expect(driverService).toBeDefined();
    expect(driverRepository).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um motorista com sucesso', async () => {
      jest.spyOn(driverRepository, 'create').mockReturnValue(driverMock);
      jest.spyOn(driverRepository, 'save').mockResolvedValue(driverMock);

      const result = await driverService.create(driverMockCreate);

      expect(result).toEqual(driverMock);

      expect(driverRepository.create).toHaveBeenCalledWith(driverMockCreate);
      expect(driverRepository.save).toHaveBeenCalledWith(driverMock);
    });
  });
});
