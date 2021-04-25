import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { Faculty } from './entities/faculty.entity';

@Injectable()
export class FacultiesService {
  constructor(
    @InjectRepository(Faculty) private facultyRepository: Repository<Faculty>,
  ) {}

  async create(createFacultyDto: CreateFacultyDto): Promise<Faculty> {
    const newFaculty = this.facultyRepository.create(createFacultyDto);
    await this.facultyRepository.save(newFaculty);
    return newFaculty;
  }

  async findAll(): Promise<Faculty[]> {
    return await this.facultyRepository.find();
  }

  async findById(id: number): Promise<Faculty> {
    const faculty = await this.facultyRepository.findOne(id);
    if (faculty) {
      return faculty;
    }
    throw new HttpException(
      'Faculty with this id does not exists',
      HttpStatus.NOT_FOUND,
    );
  }

  async update(id: number, updateFacultyDto: UpdateFacultyDto) {
    await this.facultyRepository.update(id, updateFacultyDto);
  }

  async remove(id: number) {
    await this.facultyRepository.delete(id);
  }
}
