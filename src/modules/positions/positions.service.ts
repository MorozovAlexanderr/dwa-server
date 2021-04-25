import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { Position } from './entities/position.entity';

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(Position)
    private positionRepository: Repository<Position>,
  ) {}

  async create(createPositionDto: CreatePositionDto): Promise<Position> {
    const newPosition = this.positionRepository.create(createPositionDto);
    await this.positionRepository.save(newPosition);
    return newPosition;
  }

  async findAll(): Promise<Position[]> {
    return await this.positionRepository.find();
  }

  async findById(id: number): Promise<Position> {
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
