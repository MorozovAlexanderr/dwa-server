import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsers = [
    {
      id: 1,
      username: 'John',
      email: 'ex@mple.com',
    },
  ];

  const mockUsersService = {
    getUser: jest
      .fn()
      .mockImplementation((id) => mockUsers.find((u) => u.id == id)),
    update: jest.fn().mockImplementation((id, updateUserDto) => {
      return { id, ...updateUserDto };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a user by id', () => {
    const userId = 1;
    const foundUser = mockUsers.find((u) => u.id == userId);

    expect(controller.getUserData(userId)).toEqual(foundUser);
  });

  it('should update a user by id', () => {
    const id = 1;
    const updateUserDto = {
      username: 'Jack',
      email: 'new@mail.com',
    };

    expect(controller.update(id, updateUserDto)).toEqual({
      id,
      ...updateUserDto,
    });
  });
});
