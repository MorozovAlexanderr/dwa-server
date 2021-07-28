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
    private readonly _structuresRepository: TreeRepository<StructureEntity>,
  ) {}

  // TODO: method for moving children to other parent

  async create(createStructureDto: CreateStructureDto): Promise<StructureDto> {
    const newStructure = await this._structuresRepository.create(
      createStructureDto,
    );
    console.log(newStructure);
    await this._structuresRepository.save(newStructure);
    return newStructure.toDto();
  }

  // Fetch data from relation with other entities isn`t working because it`s related to the findTrees() method
  async getAll(): Promise<StructureDto[]> {
    const structures = await this._structuresRepository.findTrees();
    return structures.map((s) => s.toDto());
  }

  async getById(id: number): Promise<StructureDto | undefined> {
    const structure = await this._structuresRepository.findOne(id);
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
      await this._structuresRepository.update(id, {
        name: updateStructureDto.name,
      });
    }

    return this.getById(id);
  }

  async remove(id: number): Promise<StructureDto> {
    const structureToDelete = await this._structuresRepository.findOne(id);
    return (await this._structuresRepository.remove(structureToDelete)).toDto();
  }
}
