import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../../users/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;

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

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when creating jwt tokens', () => {
    it('should return a string for access token', () => {
      const userId = 1;
      expect(typeof service.getJwtAccessToken(userId)).toEqual('string');
    });

    it('should return a string for refresh token', () => {
      const userId = 1;
      expect(typeof service.getJwtRefreshToken(userId)).toEqual('string');
    });
  });
});
