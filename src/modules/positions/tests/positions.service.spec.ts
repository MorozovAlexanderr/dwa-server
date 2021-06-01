import { Test, TestingModule } from '@nestjs/testing';
import { PositionsService } from '../positions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PositionEntity } from '../entities/position.entity';

describe('PositionsService', () => {
  let service: PositionsService;

  const mockPositions = [
    {
      id: 1,
      name: 'Teacher',
      priority: 10,
      toDto() {
        return { id: this.id, name: this.name, priority: this.priority };
      },
    },
  ];

  const mockPositionsRepository = {
    create: jest.fn().mockImplementation((position) =>
      Promise.resolve({
        id: Date.now(),
        ...position,
        toDto() {
          return { id: this.id, name: this.name, priority: this.priority };
        },
      }),
    ),
    save: jest.fn().mockImplementation(),
    find: jest.fn().mockImplementation(() => mockPositions),
    findOne: jest
      .fn()
      .mockImplementation((positionId) =>
        mockPositions.find((p) => p.id == positionId),
      ),
    update: jest.fn().mockImplementation(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PositionsService,
        {
          provide: getRepositoryToken(PositionEntity),
          useValue: mockPositionsRepository,
        },
      ],
    }).compile();

    service = module.get<PositionsService>(PositionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a faculty', async () => {
    const createPosDto = {
      name: 'Teacher',
      priority: 10,
    };

    expect(await service.create(createPosDto)).toEqual({
      id: expect.any(Number),
      ...createPosDto,
    });
  });

  it('should return all positions', async () => {
    const { toDto, ...pos } = mockPositions[0];
    const positions = [pos];

    expect(await service.getAll()).toEqual(positions);
  });

  it('should return a position by id', async () => {
    const posId = 1;
    const posDto = {
      id: 1,
      name: 'Teacher',
      priority: 10,
    };

    expect(await service.getById(posId)).toEqual(posDto);
  });

  it('should update a position by id', async () => {
    const id = 1;
    const posDto = {
      name: 'Teacher',
      priority: 10,
    };

    expect(await service.update(id, posDto)).toEqual({
      id,
      ...posDto,
    });
  });
});
