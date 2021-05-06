import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePositionDto } from './dtos/create-position.dto';
import { UpdatePositionDto } from './dtos/update-position.dto';
import { PositionEntity } from './entities/position.entity';
import { PositionDto } from './dtos/position.dto';

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(PositionEntity)
    private positionRepository: Repository<PositionEntity>,
  ) {}

  async create(createPositionDto: CreatePositionDto): Promise<PositionDto> {
    const newPosition = this.positionRepository.create(createPositionDto);
    await this.positionRepository.save(newPosition);
    return newPosition.toDto();
  }

  async getAll(): Promise<PositionDto[]> {
    const positions = await this.positionRepository.find();
    return positions.map((p) => p.toDto());
  }

  async getById(id: number): Promise<PositionDto> {
    const position = await this.positionRepository.findOne(id);
    if (position) {
      return position.toDto();
    }
    throw new HttpException(
      'Position with this id does not exists',
      HttpStatus.NOT_FOUND,
    );
  }

  async update(id: number, updatePositionDto: UpdatePositionDto) {
    await this.positionRepository.update(id, updatePositionDto);
  }

  async remove(id: number) {
    await this.positionRepository.delete(id);
  }
}
