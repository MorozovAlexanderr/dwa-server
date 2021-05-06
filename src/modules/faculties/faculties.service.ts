import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFacultyDto } from './dtos/create-faculty.dto';
import { UpdateFacultyDto } from './dtos/update-faculty.dto';
import { FacultyEntity } from './entities/faculty.entity';
import { FacultyDto } from './dtos/faculty.dto';

@Injectable()
export class FacultiesService {
  constructor(
    @InjectRepository(FacultyEntity)
    private facultyRepository: Repository<FacultyEntity>,
  ) {}

  async create(createFacultyDto: CreateFacultyDto): Promise<FacultyDto> {
    const newFaculty = this.facultyRepository.create(createFacultyDto);
    await this.facultyRepository.save(newFaculty);
    return newFaculty.toDto();
  }

  async getAll(): Promise<FacultyDto[]> {
    const faculties = await this.facultyRepository.find();
    return faculties.map((f) => f.toDto());
  }

  async getById(id: number): Promise<FacultyDto> {
    const faculty = await this.facultyRepository.findOne(id);
    if (faculty) {
      return faculty.toDto();
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
