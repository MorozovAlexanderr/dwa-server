import { Test, TestingModule } from '@nestjs/testing';
import { PositionsController } from '../positions.controller';
import { PositionsService } from '../positions.service';

describe('PositionsController', () => {
  let controller: PositionsController;

  const mockPositions = [
    {
      id: 1,
      name: 'Teacher',
      priority: 10,
    },
    {
      id: 2,
      name: 'Rector',
      priority: 1,
    },
  ];

  const mockPositionsService = {
    create: jest.fn().mockImplementation((dto) => {
      return {
        id: Date.now(),
        ...dto,
      };
    }),
    getAll: jest.fn().mockImplementation(() => mockPositions),
    getById: jest
      .fn()
      .mockImplementation((id) => mockPositions.find((p) => p.id == id)),
    update: jest.fn().mockImplementation((id, updatePosDto) => {
      return { id, ...updatePosDto };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PositionsController],
      providers: [PositionsService],
    })
      .overrideProvider(PositionsService)
      .useValue(mockPositionsService)
      .compile();

    controller = module.get<PositionsController>(PositionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a position', () => {
    const positionDto = {
      name: 'Teacher',
      priority: 10,
    };

    expect(controller.create(positionDto)).toEqual({
      id: expect.any(Number),
      ...positionDto,
    });
  });

  it('should return all positions', () => {
    expect(controller.getAll()).toEqual(mockPositions);
  });

  it('should return a position by id', () => {
    const posId = 1;
    const foundPos = mockPositions.find((p) => p.id == posId);

    expect(controller.getOne(1)).toEqual(foundPos);
  });

  it('should update a position by id', () => {
    const id = 1;
    const updatePosDto = {
      priority: 5,
    };

    expect(controller.update(id, updatePosDto)).toEqual({
      id,
      ...updatePosDto,
    });
  });
});
