import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkspaceEntity } from './entities/workspace.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { WorkspaceDto } from './dto/workspace.dto';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(WorkspaceEntity)
    private workspacesRepository: Repository<WorkspaceEntity>,
  ) {}

  async create(
    createWorkspaceDto: CreateWorkspaceDto,
    user: UserEntity,
  ): Promise<WorkspaceDto> {
    const newWorkspace = await this.workspacesRepository.create({
      user,
      ...createWorkspaceDto,
    });
    await this.workspacesRepository.save(newWorkspace);
    return newWorkspace.toDto();
  }

  async getAll(user: UserEntity): Promise<WorkspaceDto[]> {
    const workspaces = await this.workspacesRepository.find({
      relations: ['organization'],
      where: { user },
    });
    return workspaces.map((w) => w.toDto());
  }

  async getById(
    id: number,
    user: UserEntity,
  ): Promise<WorkspaceDto | undefined> {
    const workspace = await this.workspacesRepository.findOne({
      relations: ['organization'],
      where: { id, user },
    });
    if (workspace) {
      return workspace.toDto();
    }
    throw new HttpException(
      'Workspace with this id does not exists',
      HttpStatus.NOT_FOUND,
    );
  }

  async getCurrent(user: UserEntity): Promise<WorkspaceDto> {
    const workspace = await this.workspacesRepository.findOne({
      relations: ['organization'],
      where: { user, isCurrent: true },
    });
    return workspace.toDto();
  }

  async switch(id: number, user): Promise<WorkspaceDto> {
    const currentWorkspace = await this.getCurrent(user);

    await this.workspacesRepository.update(currentWorkspace.id, {
      isCurrent: false,
    });
    await this.workspacesRepository.update(id, {
      isCurrent: true,
    });

    return this.getById(id, user);
  }

  async remove(id: number) {
    await this.workspacesRepository.delete(id);
  }
}
