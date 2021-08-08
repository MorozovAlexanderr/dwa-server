import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { RegisterUserDto } from '../auth/dtos/user-register.dto';
import { UserNotFoundException } from '../../exceptions/user-not-found.exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _usersRepository: Repository<UserEntity>,
  ) {}

  async create(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    const newUser = this._usersRepository.create(registerUserDto);
    await this._usersRepository.save(newUser);
    return newUser;
  }

  async findOne(findData: FindConditions<UserEntity>): Promise<UserEntity> {
    return this._usersRepository.findOne(findData);
  }

  async getById(id: number): Promise<UserEntity | undefined> {
    const user = await this._usersRepository.findOne({ id });
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    if (updateUserDto.firstName) {
      await this._usersRepository.update(id, {
        firstName: updateUserDto.firstName,
      });
    }

    if (updateUserDto.secondName) {
      await this._usersRepository.update(id, {
        secondName: updateUserDto.secondName,
      });
    }

    if (updateUserDto.email) {
      await this._usersRepository.update(id, {
        email: updateUserDto.email,
      });
    }

    if (updateUserDto.password) {
      await this.updatePassword(id, updateUserDto.password);
    }

    if (updateUserDto.organization) {
      await this._usersRepository.update(id, {
        organization: updateUserDto.organization,
      });
    }

    return this.getById(id);
  }

  async updatePassword(
    userId: number,
    password: string,
  ): Promise<UpdateResult> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this._usersRepository.update(userId, {
      password: hashedPassword,
    });
  }

  async setCurrentRefreshToken(
    refreshToken: string,
    userId: number,
  ): Promise<void> {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this._usersRepository.update(userId, { currentHashedRefreshToken });
  }

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    userId: number,
  ): Promise<UserEntity | undefined> {
    const user = await this.findOne({ id: userId });

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(userId: number): Promise<UpdateResult> {
    return this._usersRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }
}
