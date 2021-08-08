import { Injectable } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkspaceEntity } from './entities/workspace.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { WorkspaceNotFoundException } from '../../exceptions/workspace-not-found.exception';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(WorkspaceEntity)
    private workspacesRepository: Repository<WorkspaceEntity>,
  ) {}

  async create(
    createWorkspaceDto: CreateWorkspaceDto,
    user: UserEntity,
  ): Promise<WorkspaceEntity> {
    const newWorkspace = await this.workspacesRepository.create({
      user,
      ...createWorkspaceDto,
    });
    await this.workspacesRepository.save(newWorkspace);
    return newWorkspace;
  }

  async getAll(user: UserEntity): Promise<WorkspaceEntity[]> {
    const workspaces = await this.workspacesRepository.find({
      relations: ['organization'],
      where: { user },
    });
    return workspaces;
  }

  async getById(
    id: number,
    user: UserEntity,
  ): Promise<WorkspaceEntity | undefined> {
    const workspace = await this.workspacesRepository.findOne({
      relations: ['organization'],
      where: { id, user },
    });
    if (!workspace) {
      throw new WorkspaceNotFoundException();
    }
    return workspace;
  }

  async getCurrent(user: UserEntity): Promise<WorkspaceEntity | undefined> {
    const workspace = await this.workspacesRepository.findOne({
      relations: ['organization'],
      where: { user, isCurrent: true },
    });
    if (!workspace) {
      throw new WorkspaceNotFoundException('current error');
    }
    return workspace;
  }

  async switch(id: number, user): Promise<WorkspaceEntity> {
    const currentWorkspace = await this.getCurrent(user);

    if (currentWorkspace) {
      await this.workspacesRepository.update(currentWorkspace.id, {
        isCurrent: false,
      });
    }

    await this.workspacesRepository.update(id, {
      isCurrent: true,
    });

    return this.getById(id, user);
  }

  async remove(id: number) {
    await this.workspacesRepository.delete(id);
  }
}
