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
  constructor(private readonly _organizationsService: OrganizationsService) {}

  @ApiOperation({ summary: 'Create organizations' })
  @ApiBody({ type: CreateOrganizationDto })
  @ApiCreatedResponse({
    description: 'Successfully created',
    type: OrganizationDto,
  })
  @ApiBearerAuth()
  @Auth(UserRole.ADMIN)
  @Post()
  async create(
    @Body() createOrganizationDto: CreateOrganizationDto,
  ): Promise<OrganizationDto> {
    const organization = await this._organizationsService.create(
      createOrganizationDto,
    );
    return organization.toDto();
  }

  @ApiOperation({ summary: 'Get all organizations' })
  @ApiResponse({
    status: 200,
    type: [OrganizationDto],
  })
  @ApiBearerAuth()
  @Auth(UserRole.ADMIN)
  @Get()
  async getAll(): Promise<OrganizationDto[]> {
    const organizations = await this._organizationsService.getAll();
    return organizations.map((o) => o.toDto());
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
  async getOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrganizationDto> {
    const organization = await this._organizationsService.getById(id);
    return organization.toDto();
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
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<OrganizationDto> {
    const organization = await this._organizationsService.update(
      id,
      updateOrganizationDto,
    );
    return organization.toDto();
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
    return this._organizationsService.remove(id);
  }
}
