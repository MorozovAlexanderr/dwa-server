import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
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
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dtos/create-position.dto';
import { UpdatePositionDto } from './dtos/update-position.dto';
import { UserRole } from '../../common/enums/roles.enum';
import { Auth } from '../auth/decorators/auth.decorator';
import { PositionDto } from './dtos/position.dto';

@ApiTags('positions')
@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @ApiOperation({ summary: 'Create position' })
  @ApiBody({ type: CreatePositionDto })
  @ApiCreatedResponse({
    description: 'The position has been successfully created.',
    type: PositionDto,
  })
  @ApiBearerAuth()
  @Auth(UserRole.ADMIN)
  @Post()
  create(@Body() createPositionDto: CreatePositionDto): Promise<PositionDto> {
    return this.positionsService.create(createPositionDto);
  }

  @ApiOperation({ summary: 'Get all positions' })
  @ApiResponse({
    status: 200,
    type: [PositionDto],
  })
  @ApiBearerAuth()
  @Auth(UserRole.ADMIN)
  @Get()
  getAll(): Promise<PositionDto[]> {
    return this.positionsService.getAll();
  }

  @ApiOperation({ summary: 'Get position by id' })
  @ApiResponse({
    status: 200,
    type: PositionDto,
  })
  @ApiNotFoundResponse({
    description: 'Position not found',
  })
  @ApiBearerAuth()
  @Auth(UserRole.ADMIN)
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number): Promise<PositionDto> {
    return this.positionsService.getById(id);
  }

  @ApiOperation({ summary: 'Update position by id' })
  @ApiResponse({
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Position not found',
  })
  @ApiBearerAuth()
  @Auth(UserRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePositionDto: UpdatePositionDto,
  ) {
    return this.positionsService.update(id, updatePositionDto);
  }

  @ApiOperation({ summary: 'Delete position by id' })
  @ApiResponse({
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Position not found',
  })
  @ApiBearerAuth()
  @Auth(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.positionsService.remove(id);
  }
}
