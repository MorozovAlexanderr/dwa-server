import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { UsersService } from '../../users/services/users.service';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../../users/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;

  const mockedConfigService = {
    get(key: string) {
      switch (key) {
        case 'JWT_EXPIRATION_TIME':
          return '3600';
      }
    },
  };

  const mockedJwtService = {
    sign: () => '',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        UsersService,
        AuthService,
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
