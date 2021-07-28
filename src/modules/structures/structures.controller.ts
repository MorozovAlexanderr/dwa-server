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
import { StructuresService } from './structures.service';
import { CreateStructureDto } from './dto/create-structure.dto';
import { UpdateStructureDto } from './dto/update-structure.dto';
import { Auth } from '../../decorators/auth.decorator';
import { UserRole } from '../../common/enums/roles.enum';
import { StructureDto } from './dto/structure.dto';

@ApiTags('structures')
@ApiBearerAuth()
@Auth(UserRole.ADMIN)
@Controller('structures')
export class StructuresController {
  constructor(private readonly _structuresService: StructuresService) {}

  @ApiOperation({ summary: 'Create structure' })
  @ApiBody({ type: CreateStructureDto })
  @ApiCreatedResponse({
    description: 'Successfully created',
    type: StructureDto,
  })
  @Post()
  create(
    @Body() createStructureDto: CreateStructureDto,
  ): Promise<StructureDto> {
    return this._structuresService.create(createStructureDto);
  }

  @ApiOperation({ summary: 'Get all structures' })
  @ApiResponse({
    status: 200,
    type: [StructureDto],
  })
  @Get()
  getAll(): Promise<StructureDto[]> {
    return this._structuresService.getAll();
  }

  @ApiOperation({ summary: 'Get structure by id' })
  @ApiResponse({
    status: 200,
    type: StructureDto,
  })
  @ApiNotFoundResponse({
    description: 'Structure not found',
  })
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number): Promise<StructureDto> {
    return this._structuresService.getById(id);
  }

  @ApiOperation({ summary: 'Update structure by id' })
  @ApiResponse({
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Structure not found',
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStructureDto: UpdateStructureDto,
  ): Promise<StructureDto> {
    return this._structuresService.update(id, updateStructureDto);
  }

  @ApiOperation({ summary: 'Delete structure by id' })
  @ApiResponse({
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Structure not found',
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<StructureDto> {
    return this._structuresService.remove(id);
  }
}
