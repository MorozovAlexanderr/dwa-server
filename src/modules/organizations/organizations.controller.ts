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
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dtos/create-organization.dto';
import { UpdateOrganizationDto } from './dtos/update-organization.dto';
import { UserRole } from '../../common/enums/roles.enum';
import { Auth } from '../../decorators/auth.decorator';
import { OrganizationDto } from './dtos/organization.dto';

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  // TODO: endpoint for getting organizations with public access (using in registration)

  @ApiOperation({ summary: 'Create organizations' })
  @ApiBody({ type: CreateOrganizationDto })
  @ApiCreatedResponse({
    description: 'The organization has been successfully created.',
    type: OrganizationDto,
  })
  @ApiBearerAuth()
  @Auth(UserRole.ADMIN)
  @Post()
  create(
    @Body() createOrganizationDto: CreateOrganizationDto,
  ): Promise<OrganizationDto> {
    return this.organizationsService.create(createOrganizationDto);
  }

  @ApiOperation({ summary: 'Get all organizations' })
  @ApiResponse({
    status: 200,
    type: [OrganizationDto],
  })
  @ApiBearerAuth()
  @Auth(UserRole.ADMIN)
  @Get()
  getAll(): Promise<OrganizationDto[]> {
    return this.organizationsService.getAll();
  }

  @ApiOperation({ summary: 'Get organization by id' })
  @ApiResponse({
    status: 200,
    type: OrganizationDto,
  })
  @ApiNotFoundResponse({
    description: 'Organization not found',
  })
  @ApiBearerAuth()
  @Auth(UserRole.ADMIN)
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number): Promise<OrganizationDto> {
    return this.organizationsService.getById(id);
  }

  @ApiOperation({ summary: 'Update organization by id' })
  @ApiResponse({
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Organization not found',
  })
  @ApiBearerAuth()
  @Auth(UserRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<OrganizationDto> {
    return this.organizationsService.update(id, updateOrganizationDto);
  }

  @ApiOperation({ summary: 'Delete organization by id' })
  @ApiResponse({
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Organizations not found',
  })
  @ApiBearerAuth()
  @Auth(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.organizationsService.remove(id);
  }
}
