import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStructureDto } from './dto/create-structure.dto';
import { UpdateStructureDto } from './dto/update-structure.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StructureEntity } from './entities/structure.entity';
import { TreeRepository } from 'typeorm';
import { StructureDto } from './dto/structure.dto';

@Injectable()
export class StructuresService {
  constructor(
    @InjectRepository(StructureEntity)
    private structuresRepository: TreeRepository<StructureEntity>,
  ) {}

  // TODO: move children to other parent

  async create(createStructureDto: CreateStructureDto): Promise<StructureDto> {
    const newStructure = await this.structuresRepository.create(
      createStructureDto,
    );
    await this.structuresRepository.save(newStructure);
    return newStructure.toDto();
  }

  async getAll(): Promise<StructureDto[]> {
    const structures = await this.structuresRepository.findTrees();
    return structures.map((s) => s.toDto());
  }

  async getById(id: number): Promise<StructureDto> {
    const structure = await this.structuresRepository.findOne(id);
    if (structure) {
      return structure.toDto();
    }
    throw new HttpException(
      'Structure with this id does not exists',
      HttpStatus.NOT_FOUND,
    );
  }

  async update(
    id: number,
    updateStructureDto: UpdateStructureDto,
  ): Promise<StructureDto> {
    if (updateStructureDto.name) {
      await this.structuresRepository.update(id, {
        name: updateStructureDto.name,
      });
    }

    return this.getById(id);
  }

  async remove(id: number): Promise<StructureDto> {
    const structureToDelete = await this.structuresRepository.findOne(id);
    return (await this.structuresRepository.remove(structureToDelete)).toDto();
  }
}
