import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../entities/user.entity';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { RegisterUserDto } from '../../auth/dtos/user-register.dto';
import { UserNotFoundException } from '../../../exceptions/user-not-found.exception';

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

  async getAll(user: UserEntity): Promise<UserEntity[]> {
    const queryBuilder = this._usersRepository.createQueryBuilder('users');
    const users = await queryBuilder
      .leftJoinAndSelect('users.userWorkspace', 'userWorkspace')
      .where('userWorkspace.organization.id = :orgId', {
        orgId: user.userWorkspace.organization.id,
      })
      .andWhere('users.id != :userId', {
        userId: user.id,
      })
      .getMany();
    return users;
  }

  async getUser(
    findData: FindConditions<UserEntity>,
  ): Promise<UserEntity | undefined> {
    const user = await this._usersRepository.findOne({
      relations: ['userWorkspace', 'userWorkspace.organization'],
      where: findData,
    });
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }

  async update(
    user: UserEntity,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    if (updateUserDto.firstName) {
      await this._usersRepository.update(user.id, {
        firstName: updateUserDto.firstName,
      });
    }

    if (updateUserDto.secondName) {
      await this._usersRepository.update(user.id, {
        secondName: updateUserDto.secondName,
      });
    }

    if (updateUserDto.email) {
      await this._usersRepository.update(user.id, {
        email: updateUserDto.email,
      });
    }

    if (updateUserDto.password) {
      await this.updatePassword(user.id, updateUserDto.password);
    }

    return this.getUser({ id: user.id });
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
    const user = await this.getUser({ id: userId });

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
