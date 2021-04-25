import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { PositionEntity } from './entities/position.entity';

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(PositionEntity)
    private positionRepository: Repository<PositionEntity>,
  ) {}

  async create(createPositionDto: CreatePositionDto): Promise<PositionEntity> {
    const newPosition = this.positionRepository.create(createPositionDto);
    await this.positionRepository.save(newPosition);
    return newPosition;
  }

  async findAll(): Promise<PositionEntity[]> {
    return await this.positionRepository.find();
  }

  async findById(id: number): Promise<PositionEntity> {
    const position = await this.positionRepository.findOne(id);
    if (position) {
      return position;
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
