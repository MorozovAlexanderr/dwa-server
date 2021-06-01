import { Test, TestingModule } from '@nestjs/testing';
import { FacultiesService } from '../faculties.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FacultyEntity } from '../entities/faculty.entity';

describe('FacultiesService', () => {
  let service: FacultiesService;

  const mockFaculties = [
    {
      id: 1,
      name: 'FAC1',
      toDto() {
        return { id: this.id, name: this.name };
      },
    },
  ];

  const mockFacultiesRepository = {
    create: jest.fn().mockImplementation((faculty) =>
      Promise.resolve({
        id: Date.now(),
        ...faculty,
        toDto() {
          return { id: this.id, name: this.name };
        },
      }),
    ),
    save: jest.fn().mockImplementation(),
    find: jest.fn().mockImplementation(() => mockFaculties),
    findOne: jest
      .fn()
      .mockImplementation((facultyId) =>
        mockFaculties.find((f) => f.id == facultyId),
      ),
    update: jest.fn().mockImplementation(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FacultiesService,
        {
          provide: getRepositoryToken(FacultyEntity),
          useValue: mockFacultiesRepository,
        },
      ],
    }).compile();

    service = module.get<FacultiesService>(FacultiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a faculty', async () => {
    const createFacDto = {
      name: 'FAC1',
    };

    expect(await service.create(createFacDto)).toEqual({
      id: expect.any(Number),
      ...createFacDto,
    });
  });

  it('should return all faculties', async () => {
    const { toDto, ...fac } = mockFaculties[0];
    const faculties = [fac];

    expect(await service.getAll()).toEqual(faculties);
  });

  it('should return a faculty by id', async () => {
    const facId = 1;
    const facDto = {
      id: 1,
      name: 'FAC1',
    };

    expect(await service.getById(facId)).toEqual(facDto);
  });

  it('should update a faculty by id', async () => {
    const id = 1;
    const facDto = {
      name: 'FAC1',
    };

    expect(await service.update(id, facDto)).toEqual({
      id,
      ...facDto,
    });
  });
});
