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
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FacultiesService } from './faculties.service';
import { CreateFacultyDto } from './dtos/create-faculty.dto';
import { UpdateFacultyDto } from './dtos/update-faculty.dto';
import { UserRole } from '../../common/enums/roles.enum';
import { Auth } from '../auth/decorators/auth.decorator';
import { FacultyDto } from './dtos/faculty.dto';

@ApiTags('faculties')
@Controller('faculties')
export class FacultiesController {
  constructor(private readonly facultiesService: FacultiesService) {}

  // TODO: endpoint for getting faculties with public access (using in registration)

  @ApiOperation({ summary: 'Create faculty' })
  @ApiBody({ type: CreateFacultyDto })
  @ApiCreatedResponse({
    description: 'The faculty has been successfully created.',
    type: FacultyDto,
  })
  @ApiBearerAuth()
  @Auth(UserRole.ADMIN)
  @Post()
  create(@Body() createFacultyDto: CreateFacultyDto): Promise<FacultyDto> {
    return this.facultiesService.create(createFacultyDto);
  }

  @ApiOperation({ summary: 'Get all faculties' })
  @ApiResponse({
    status: 200,
    type: [FacultyDto],
  })
  @ApiBearerAuth()
  @Auth(UserRole.ADMIN)
  @Get()
  getAll(): Promise<FacultyDto[]> {
    return this.facultiesService.getAll();
  }

  @ApiOperation({ summary: 'Get faculty by id' })
  @ApiResponse({
    status: 200,
    type: FacultyDto,
  })
  @ApiNotFoundResponse({
    description: 'Faculty not found',
  })
  @ApiBearerAuth()
  @Auth(UserRole.ADMIN)
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number): Promise<FacultyDto> {
    return this.facultiesService.getById(id);
  }

  @ApiOperation({ summary: 'Update faculty by id' })
  @ApiResponse({
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Faculty not found',
  })
  @ApiBearerAuth()
  @Auth(UserRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFacultyDto: UpdateFacultyDto,
  ): Promise<FacultyDto> {
    return this.facultiesService.update(id, updateFacultyDto);
  }

  @ApiOperation({ summary: 'Delete faculty by id' })
  @ApiResponse({
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Faculty not found',
  })
  @ApiBearerAuth()
  @Auth(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.facultiesService.remove(id);
  }
}
