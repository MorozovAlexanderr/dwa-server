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
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Position } from './entities/position.entity';

@ApiTags('positions')
@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @ApiOperation({ summary: 'Create position' })
  @ApiBody({ type: CreatePositionDto })
  @ApiCreatedResponse({
    description: 'The position has been successfully created.',
    type: Position,
  })
  @Post()
  create(@Body() createPositionDto: CreatePositionDto): Promise<Position> {
    return this.positionsService.create(createPositionDto);
  }

  @ApiOperation({ summary: 'Get all positions' })
  @ApiResponse({
    status: 200,
    type: [Position],
  })
  @Get()
  findAll(): Promise<Position[]> {
    return this.positionsService.findAll();
  }

  @ApiOperation({ summary: 'Get position by id' })
  @ApiResponse({
    status: 200,
    type: Position,
  })
  @ApiNotFoundResponse({
    description: 'Position not found',
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Position> {
    return this.positionsService.findById(id);
  }

  @ApiOperation({ summary: 'Update position by id' })
  @ApiResponse({
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Position not found',
  })
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
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.positionsService.remove(id);
  }
}
