import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { saveDocumentToStorage } from '../../utils/file-uploading';

@ApiTags('documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, WorkspaceRolesGuard)
@WorkspaceRoles(UserWorkspaceRole.ADMIN, UserWorkspaceRole.MEMBER)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly _documentsService: DocumentsService) {}

  // TODO: fix the swagger api body description

  @ApiOperation({ summary: 'Upload and create document' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        signerIds: { type: 'array' },
        expiresAt: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCreatedResponse({
    type: DocumentDto,
  })
  @UseInterceptors(FileInterceptor('file', saveDocumentToStorage))
  @Post()
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDocumentDto: CreateDocumentDto,
    @AuthUser() user: UserEntity,
  ): Promise<DocumentDto> {
    const document = await this._documentsService.create(
      file.path,
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

  @ApiOperation({ summary: 'Get document file by id' })
  @ApiOkResponse({
    schema: {
      type: 'file',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Get(':uuid')
  async getOne(
    @Param('uuid') uuid: string,
    @AuthUser() user: UserEntity,
    @Res() res,
  ): Promise<void> {
    const document = await this._documentsService.getDocument(uuid, user);
    res.sendfile(document.filePath, { root: './' });
  }

  @ApiOperation({ summary: 'Update document by id' })
  @ApiResponse({
    status: 200,
    type: DocumentDto,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':uuid')
  async update(
    @Param('uuid') uuid: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @AuthUser() user: UserEntity,
  ): Promise<DocumentDto> {
    const document = await this._documentsService.update(
      uuid,
      updateDocumentDto,
      user,
    );
    return document.toDto();
  }

  @ApiOperation({ summary: 'Delete document by id' })
  @ApiResponse({
    status: 200,
  })
  @Delete(':uuid')
  remove(@Param('uuid') uuid: string, @AuthUser() user: UserEntity) {
    return this._documentsService.remove(uuid, user);
  }
}
