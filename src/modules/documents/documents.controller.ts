import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentDto } from './dto/document.dto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import JwtAuthGuard from '../../guards/jwt.-auth.guard';
import { WorkspaceRolesGuard } from '../../guards/workspace-roles.guard';
import { WorkspaceRoles } from '../../decorators/workspace-roles.decorator';
import { UserWorkspaceRole } from '../../common/enums/workspace-roles.enum';

@ApiTags('documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, WorkspaceRolesGuard)
@WorkspaceRoles(UserWorkspaceRole.ADMIN, UserWorkspaceRole.MEMBER)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly _documentsService: DocumentsService) {}

  @ApiOperation({ summary: 'Create document' })
  @ApiBody({ type: CreateDocumentDto })
  @ApiCreatedResponse({
    type: DocumentDto,
  })
  @Post()
  async create(
    @Body() createDocumentDto: CreateDocumentDto,
    @AuthUser() user: UserEntity,
  ): Promise<DocumentDto> {
    const document = await this._documentsService.create(
      createDocumentDto,
      user,
    );
    return document.toDto();
  }

  @ApiOperation({ summary: 'Get all documents' })
  @ApiResponse({
    status: 200,
    type: [DocumentDto],
  })
  @Get()
  async getAll(@AuthUser() user: UserEntity): Promise<DocumentDto[]> {
    const documents = await this._documentsService.getAll(user);
    return documents.map((d) => d.toDto());
  }

  @ApiOperation({ summary: 'Get document by id' })
  @ApiResponse({
    status: 200,
    type: DocumentDto,
  })
  @Get(':id')
  async getOne(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: UserEntity,
  ): Promise<DocumentDto> {
    const document = await this._documentsService.getById(id, user);
    return document.toDto();
  }

  @ApiOperation({ summary: 'Update document by id' })
  @ApiResponse({
    status: 200,
    type: DocumentDto,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @AuthUser() user: UserEntity,
  ): Promise<DocumentDto> {
    const document = await this._documentsService.update(
      id,
      updateDocumentDto,
      user,
    );
    return document.toDto();
  }

  @ApiOperation({ summary: 'Delete document by id' })
  @ApiResponse({
    status: 200,
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @AuthUser() user: UserEntity) {
    return this._documentsService.remove(id, user);
  }
}
