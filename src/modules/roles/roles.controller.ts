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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from './entities/role.entity';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({ summary: 'Create role' })
  @ApiBody({ type: CreateRoleDto })
  @ApiCreatedResponse({
    description: 'The role has been successfully created.',
    type: Role,
  })
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({
    status: 200,
    type: [Role],
  })
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @ApiOperation({ summary: 'Get role by id' })
  @ApiResponse({
    status: 200,
    type: Role,
  })
  @ApiNotFoundResponse({
    description: 'Role not found',
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findById(id);
  }

  @ApiOperation({ summary: 'Update role by id' })
  @ApiResponse({
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Role not found',
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @ApiOperation({ summary: 'Delete role by id' })
  @ApiResponse({
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Role not found',
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.remove(id);
  }
}
