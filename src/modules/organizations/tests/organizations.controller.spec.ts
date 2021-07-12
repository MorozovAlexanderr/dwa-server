import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationsController } from '../organizations.controller';
import { OrganizationsService } from '../organizations.service';

describe('OrganizationsController', () => {
  let controller: OrganizationsController;

  const mockOrganizations = [
    {
      id: 1,
      name: 'FAC1',
    },
    {
      id: 2,
      name: 'FAC2',
    },
  ];

  const mockOrganizationsService = {
    create: jest.fn().mockImplementation((dto) => {
      return {
        id: Date.now(),
        ...dto,
      };
    }),
    getAll: jest.fn().mockImplementation(() => mockOrganizations),
    getById: jest
      .fn()
      .mockImplementation((id) => mockOrganizations.find((o) => o.id == id)),
    update: jest.fn().mockImplementation((id, updateOrgDto) => {
      return { id, ...updateOrgDto };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationsController],
      providers: [OrganizationsService],
    })
      .overrideProvider(OrganizationsService)
      .useValue(mockOrganizationsService)
      .compile();

    controller = module.get<OrganizationsController>(OrganizationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a organization', () => {
    const organizationDto = {
      name: 'FAC1',
    };

    expect(controller.create(organizationDto)).toEqual({
      id: expect.any(Number),
      ...organizationDto,
    });
  });

  it('should return all organizations', () => {
    expect(controller.getAll()).toEqual(mockOrganizations);
  });

  it('should return a organization by id', () => {
    const orgId = 1;
    const foundOrg = mockOrganizations.find((o) => o.id == orgId);

    expect(controller.getOne(1)).toEqual(foundOrg);
  });

  it('should update a organization by id', () => {
    const id = 1;
    const updateOrgDto = {
      name: 'FAC1',
    };

    expect(controller.update(id, updateOrgDto)).toEqual({
      id,
      ...updateOrgDto,
    });
  });
});
