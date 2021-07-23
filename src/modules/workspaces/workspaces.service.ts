import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
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

  create(createWorkspaceDto: CreateWorkspaceDto) {
    return 'This action adds a new workspace';
  }

  async getAll(user: UserEntity): Promise<WorkspaceDto[]> {
    const workspaces = await this.workspacesRepository.find({
      relations: ['organization', 'structure', 'position'],
      where: { user },
    });
    return workspaces.map((w) => w.toDto());
  }

  async getById(id: number, user: UserEntity): Promise<WorkspaceDto> {
    const workspace = await this.workspacesRepository.findOne({
      relations: ['organization', 'structure', 'position'],
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

  update(id: number, updateWorkspaceDto: UpdateWorkspaceDto) {
    return `This action updates a #${id} workspace`;
  }

  remove(id: number) {
    return `This action removes a #${id} workspace`;
  }
}
