import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FacultysService } from './facultys.service';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';

@Controller('facultys')
export class FacultysController {
  constructor(private readonly facultysService: FacultysService) {}

  @Post()
  create(@Body() createFacultyDto: CreateFacultyDto) {
    return this.facultysService.create(createFacultyDto);
  }

  @Get()
  findAll() {
    return this.facultysService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.facultysService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFacultyDto: UpdateFacultyDto) {
    return this.facultysService.update(+id, updateFacultyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.facultysService.remove(+id);
  }
}
