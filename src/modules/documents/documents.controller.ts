import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
import { DocumentsService } from './services/documents.service';
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
import { SignatureStatus } from './enums/signature-statuses.enum';
import { DocStatusQueryParamPipe } from '../../pipes/doc-status-query-param.pipe';
import { DocumentSignatureDto } from './dto/document-signature.dto';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { DocumentAccessGuard } from './guards/document-access.guard';

@ApiTags('documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, WorkspaceRolesGuard)
@WorkspaceRoles(UserWorkspaceRole.ADMIN, UserWorkspaceRole.MEMBER)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly _documentsService: DocumentsService) {}

  // TODO: file must not be save if dto validation fails

  @ApiOperation({ summary: 'Upload and create document' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateDocumentDto })
  @ApiCreatedResponse({
    type: DocumentDto,
  })
  @UseInterceptors(FileInterceptor('file', saveDocumentToStorage))
  @Post()
  async createDocument(
    @UploadedFile('file') file: Express.Multer.File,
    @Body() createDocumentDto: CreateDocumentDto,
    @AuthUser() user: UserEntity,
  ): Promise<DocumentDto> {
    const document = await this._documentsService.createDocument(
      file.path,
      createDocumentDto,
      user,
    );
    return document.toDto();
  }

  @ApiOperation({ summary: 'Process document' })
  @ApiResponse({
    status: 200,
    type: DocumentDto,
  })
  @ApiImplicitQuery({ name: 'status', required: true, enum: SignatureStatus })
  @UseGuards(DocumentAccessGuard)
  @Patch(':uuid/process')
  async processDocument(
    @Param('uuid') uuid: string,
    @Query('status', new DocStatusQueryParamPipe())
    status: SignatureStatus,
    @AuthUser() user: UserEntity,
  ): Promise<DocumentDto> {
    const document = await this._documentsService.processDocument(
      uuid,
      user,
      status,
    );
    return document.toDto();
  }

  @ApiOperation({ summary: 'Get created documents' })
  @ApiResponse({
    status: 200,
    type: [DocumentDto],
  })
  @Get('created')
  async getUserCreatedDocuments(
    @AuthUser() user: UserEntity,
  ): Promise<DocumentDto[]> {
    const createdDocuments = await this._documentsService.getCreatedDocuments(
      user,
    );
    return createdDocuments.map((d) => d.toDto());
  }

  @ApiOperation({ summary: 'Get signing documents' })
  @ApiResponse({
    status: 200,
    type: [DocumentDto],
  })
  @Get('signing')
  async getUserSigningDocuments(
    @AuthUser() user: UserEntity,
  ): Promise<DocumentDto[]> {
    const signingDocuments = await this._documentsService.getSigningDocuments(
      user,
    );
    return signingDocuments.map((d) => d.toDto());
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
  @UseGuards(DocumentAccessGuard)
  @Get(':uuid')
  async getDocument(@Param('uuid') uuid: string, @Res() res): Promise<void> {
    const document = await this._documentsService.getDocument({
      uuid,
    });
    res.sendfile(document.filePath, { root: './' });
  }

  @ApiOperation({ summary: 'Get document signatures' })
  @ApiResponse({
    status: 200,
    type: [DocumentSignatureDto],
  })
  @UseGuards(DocumentAccessGuard)
  @Get(':uuid/signatures')
  async getDocumentSignatures(
    @Param('uuid') uuid: string,
  ): Promise<DocumentSignatureDto[]> {
    const documentSignatures = await this._documentsService.getDocumentSignatures(
      uuid,
    );
    return documentSignatures.map((s) => s.toDto());
  }

  @ApiOperation({ summary: 'Update document by id' })
  @ApiBody({
    type: UpdateDocumentDto,
  })
  @ApiResponse({
    status: 200,
    type: DocumentDto,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':uuid')
  async setDocumentData(
    @Param('uuid') uuid: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @AuthUser() user: UserEntity,
  ): Promise<DocumentDto> {
    const document = await this._documentsService.updateDocumentData(
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
  deleteDocument(@Param('uuid') uuid: string, @AuthUser() user: UserEntity) {
    return this._documentsService.removeDocument(uuid, user);
  }
}
