import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { FacultiesService } from './faculties.service';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Faculty } from './entities/faculty.entity';

@ApiTags('faculties')
@Controller('faculties')
export class FacultiesController {
  constructor(private readonly facultiesService: FacultiesService) {}

  @ApiOperation({ summary: 'Create faculty' })
  @ApiBody({ type: CreateFacultyDto })
  @ApiCreatedResponse({
    description: 'The faculty has been successfully created.',
    type: Faculty,
  })
  @Post()
  create(@Body() createFacultyDto: CreateFacultyDto): Promise<Faculty> {
    return this.facultiesService.create(createFacultyDto);
  }

  @ApiOperation({ summary: 'Get all faculties' })
  @ApiResponse({
    status: 200,
    type: [Faculty],
  })
  @Get()
  findAll(): Promise<Faculty[]> {
    return this.facultiesService.findAll();
  }

  @ApiOperation({ summary: 'Get faculty by id' })
  @ApiResponse({
    status: 200,
    type: Faculty,
  })
  @ApiNotFoundResponse({
    description: 'Faculty not found',
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Faculty> {
    return this.facultiesService.findById(id);
  }

  @ApiOperation({ summary: 'Update faculty by id' })
  @ApiResponse({
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Faculty not found',
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFacultyDto: UpdateFacultyDto,
  ) {
    return this.facultiesService.update(id, updateFacultyDto);
  }

  @ApiOperation({ summary: 'Delete faculty by id' })
  @ApiResponse({
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Faculty not found',
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.facultiesService.remove(id);
  }
}
