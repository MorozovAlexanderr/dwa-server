import { Test, TestingModule } from '@nestjs/testing';
import { FacultiesController } from '../faculties.controller';
import { FacultiesService } from '../faculties.service';

describe('FacultiesController', () => {
  let controller: FacultiesController;

  const mockFaculties = [
    {
      id: 1,
      name: 'FAC1',
    },
    {
      id: 2,
      name: 'FAC2',
    },
  ];

  const mockFacultiesService = {
    create: jest.fn().mockImplementation((dto) => {
      return {
        id: Date.now(),
        ...dto,
      };
    }),
    getAll: jest.fn().mockImplementation(() => mockFaculties),
    getById: jest
      .fn()
      .mockImplementation((id) => mockFaculties.find((f) => f.id == id)),
    update: jest.fn().mockImplementation((id, updateFacDto) => {
      return { id, ...updateFacDto };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FacultiesController],
      providers: [FacultiesService],
    })
      .overrideProvider(FacultiesService)
      .useValue(mockFacultiesService)
      .compile();

    controller = module.get<FacultiesController>(FacultiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a faculty', () => {
    const facultyDto = {
      name: 'FAC1',
    };

    expect(controller.create(facultyDto)).toEqual({
      id: expect.any(Number),
      ...facultyDto,
    });
  });

  it('should return all faculties', () => {
    expect(controller.getAll()).toEqual(mockFaculties);
  });

  it('should return a faculty by id', () => {
    const facId = 1;
    const foundFac = mockFaculties.find((f) => f.id == facId);

    expect(controller.getOne(1)).toEqual(foundFac);
  });

  it('should update a faculty by id', () => {
    const id = 1;
    const updateFacDto = {
      name: 'FAC1',
    };

    expect(controller.update(id, updateFacDto)).toEqual({
      id,
      ...updateFacDto,
    });
  });
});
