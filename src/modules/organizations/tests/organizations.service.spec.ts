import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationsService } from '../organizations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrganizationEntity } from '../entities/organization.entity';

describe('FacultiesService', () => {
  let service: OrganizationsService;

  const mockOrganizations = [
    {
      id: 1,
      name: 'FAC1',
      toDto() {
        return { id: this.id, name: this.name };
      },
    },
  ];

  const mockOrganizationsRepository = {
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
    find: jest.fn().mockImplementation(() => mockOrganizations),
    findOne: jest
      .fn()
      .mockImplementation((organizationId) =>
        mockOrganizations.find((o) => o.id == organizationId),
      ),
    update: jest.fn().mockImplementation(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationsService,
        {
          provide: getRepositoryToken(OrganizationEntity),
          useValue: mockOrganizationsRepository,
        },
      ],
    }).compile();

    service = module.get<OrganizationsService>(OrganizationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a organization', async () => {
    const createOrgDto = {
      name: 'FAC1',
    };

    expect(await service.create(createOrgDto)).toEqual({
      id: expect.any(Number),
      ...createOrgDto,
    });
  });

  it('should return all organizations', async () => {
    const { toDto, ...fac } = mockOrganizations[0];
    const organizations = [fac];

    expect(await service.getAll()).toEqual(organizations);
  });

  it('should return a organization by id', async () => {
    const orgId = 1;
    const orgDto = {
      id: 1,
      name: 'FAC1',
    };

    expect(await service.getById(orgId)).toEqual(orgDto);
  });

  it('should update a organization by id', async () => {
    const id = 1;
    const orgDto = {
      name: 'FAC1',
    };

    expect(await service.update(id, orgDto)).toEqual({
      id,
      ...orgDto,
    });
  });
});
