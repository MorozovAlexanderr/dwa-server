import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { Repository } from 'typeorm';
import { Faculty } from './entities/faculty.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FacultysService {
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
    const faculty = this.facultyRepository.findOne(id);
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
