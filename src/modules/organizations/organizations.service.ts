import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrganizationDto } from './dtos/create-organization.dto';
import { UpdateOrganizationDto } from './dtos/update-organization.dto';
import { OrganizationEntity } from './entities/organization.entity';
import { OrganizationDto } from './dtos/organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(OrganizationEntity)
    private organizationsRepository: Repository<OrganizationEntity>,
  ) {}

  async create(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<OrganizationDto> {
    const newFaculty = await this.organizationsRepository.create(
      createOrganizationDto,
    );
    await this.organizationsRepository.save(newFaculty);
    return newFaculty.toDto();
  }

  async getAll(): Promise<OrganizationDto[]> {
    const organizations = await this.organizationsRepository.find();
    return organizations.map((o) => o.toDto());
  }

  async getById(id: number): Promise<OrganizationDto> {
    const organization = await this.organizationsRepository.findOne(id);
    if (organization) {
      return organization.toDto();
    }
    throw new HttpException(
      'Organization with this id does not exists',
      HttpStatus.NOT_FOUND,
    );
  }

  async update(
    id: number,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<OrganizationDto> {
    if (updateOrganizationDto.name) {
      await this.organizationsRepository.update(id, {
        name: updateOrganizationDto.name,
      });
    }

    return this.getById(id);
  }

  async remove(id: number) {
    await this.organizationsRepository.delete(id);
  }
}
