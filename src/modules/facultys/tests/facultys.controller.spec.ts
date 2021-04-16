import { Test, TestingModule } from '@nestjs/testing';
import { FacultysController } from '../facultys.controller';
import { FacultysService } from '../facultys.service';

describe('FacultysController', () => {
  let controller: FacultysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FacultysController],
      providers: [FacultysService],
    }).compile();

    controller = module.get<FacultysController>(FacultysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
