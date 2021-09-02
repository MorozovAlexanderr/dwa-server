import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserWorkspaceEntity } from '../entities/user-workspace.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { CreateUserWorkspaceDto } from '../dtos/create-user-workspace.dto';

@Injectable()
export class UsersWorkspaceService {
  constructor(
    @InjectRepository(UserWorkspaceEntity)
    private readonly _usersWorkspaceRepository: Repository<UserWorkspaceEntity>,
  ) {}

  public async createWorkspace(
    user: UserEntity,
    createUserWorkspaceDto: CreateUserWorkspaceDto,
  ): Promise<UserWorkspaceEntity> {
    const userWorkspace = this._usersWorkspaceRepository.create({
      user,
      ...createUserWorkspaceDto,
    });
    await this._usersWorkspaceRepository.save(userWorkspace);
    return userWorkspace;
  }
}
