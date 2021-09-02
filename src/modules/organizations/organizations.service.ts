import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrganizationDto } from './dtos/create-organization.dto';
import { UpdateOrganizationDto } from './dtos/update-organization.dto';
import { OrganizationEntity } from './entities/organization.entity';
import { OrganizationNotFoundException } from '../../exceptions/organization-not-found.exception';
import { UserEntity } from '../users/entities/user.entity';
import { UsersWorkspaceService } from '../users/services/users-workspace.service';
import { UserWorkspaceRole } from '../../common/enums/workspace-roles.enum';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(OrganizationEntity)
    private readonly _organizationsRepository: Repository<OrganizationEntity>,
    private readonly _usersWorkspaceService: UsersWorkspaceService,
  ) {}

  public async createOrganization(
    createOrganizationDto: CreateOrganizationDto,
    user: UserEntity,
  ): Promise<OrganizationEntity> {
    const newOrganization = await this._organizationsRepository.create(
      createOrganizationDto,
    );
    await this._organizationsRepository.save(newOrganization);

    await this._usersWorkspaceService.createWorkspace(user, {
      accessLevel: UserWorkspaceRole.ADMIN,
      organization: newOrganization,
    });

    return newOrganization;
  }

  public async getOrganizationById(
    id: number,
  ): Promise<OrganizationEntity | undefined> {
    const organization = await this._organizationsRepository.findOne(id);
    if (!organization) {
      throw new OrganizationNotFoundException();
    }
    return organization;
  }

  public async updateOrganizationData(
    id: number,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<OrganizationEntity> {
    if (updateOrganizationDto.name) {
      await this._organizationsRepository.update(id, {
        name: updateOrganizationDto.name,
      });
    }

    return this.getOrganizationById(id);
  }
}
