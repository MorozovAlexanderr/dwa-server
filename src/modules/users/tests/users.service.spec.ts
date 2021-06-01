import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;

  const mockUsers = [
    {
      id: 1,
      username: 'John',
      email: 'ex@mple.com',
      password: '1234567',
      currentHashedRefreshToken: 'rToken',
      toDto() {
        return { id: this.id, username: this.username, email: this.email };
      },
    },
  ];

  const mockUsersRepository = {
    findOne: jest
      .fn()
      .mockImplementation((userId) => mockUsers.find((u) => u.id == userId)),
    update: jest.fn().mockImplementation(),
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((user) =>
        Promise.resolve({ id: Date.now(), ...user }),
      ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto = {
      username: 'Jack Johnson',
      email: 'ex@mple.com',
      password: '1234567',
      faculty: {
        id: 1,
        createdAt: new Date('2021-04-25T14:36:30.943Z'),
        updatedAt: new Date('2021-05-08T13:05:39.000Z'),
        name: 'FKSFM',
      },
      position: {
        id: 2,
        createdAt: new Date('2021-04-25T14:36:31.400Z'),
        updatedAt: new Date('2021-04-25T14:36:31.797Z'),
        name: 'Rector',
        priority: 1,
      },
    };

    expect(await service.create(createUserDto)).toEqual({
      id: expect.any(Number),
      ...createUserDto,
    });
  });

  it('should return a user by id', async () => {
    const userId = 1;
    const userDto = {
      id: 1,
      username: 'John',
      email: 'ex@mple.com',
    };

    expect(await service.getUser(userId)).toEqual(userDto);
  });

  it('should throw a 404 for user with wrong id', async () => {
    const userId = 2;

    // Check if the assertion below was called
    expect.assertions(1);

    try {
      await service.getUser(userId);
    } catch (e) {
      expect(e.status).toEqual(404);
    }
  });

  it('should update a user by id', async () => {
    const id = 1;
    const updateUserDto = {
      username: 'John',
      email: 'ex@mple.com',
    };

    expect(await service.update(id, updateUserDto)).toEqual({
      id,
      ...updateUserDto,
    });
  });
});
