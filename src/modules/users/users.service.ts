import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { RegisterUserDto } from '../auth/dtos/user-register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create(registerUserDto: RegisterUserDto): Promise<UserDto> {
    const newUser = this.usersRepository.create(registerUserDto);
    await this.usersRepository.save(newUser);
    return newUser.toDto();
  }

  async findOne(findData: FindConditions<UserEntity>): Promise<UserEntity> {
    return this.usersRepository.findOne(findData);
  }

  async getUser(id: number): Promise<UserDto> {
    const user = await this.usersRepository.findOne({ id });
    if (user) {
      return user.toDto();
    }
    throw new HttpException(
      'User with this id does not exists',
      HttpStatus.NOT_FOUND,
    );
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserDto> {
    if (updateUserDto.firstName) {
      await this.usersRepository.update(id, {
        firstName: updateUserDto.firstName,
      });
    }

    if (updateUserDto.secondName) {
      await this.usersRepository.update(id, {
        secondName: updateUserDto.secondName,
      });
    }

    if (updateUserDto.email) {
      await this.usersRepository.update(id, {
        email: updateUserDto.email,
      });
    }

    if (updateUserDto.password) {
      await this.updatePassword(id, updateUserDto.password);
    }

    return this.getUser(id);
  }

  async updatePassword(
    userId: number,
    password: string,
  ): Promise<UpdateResult> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.usersRepository.update(userId, {
      password: hashedPassword,
    });
  }

  async setCurrentRefreshToken(
    refreshToken: string,
    userId: number,
  ): Promise<void> {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, { currentHashedRefreshToken });
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
    return this.usersRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }
}
