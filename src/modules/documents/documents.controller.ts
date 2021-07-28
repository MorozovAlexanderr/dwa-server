import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
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
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Auth } from '../../decorators/auth.decorator';
import { UserRole } from '../../common/enums/roles.enum';
import { DocumentDto } from './dto/document.dto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { UserEntity } from '../users/entities/user.entity';

@ApiTags('documents')
@ApiBearerAuth()
@Auth(UserRole.ADMIN, UserRole.USER)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly _documentsService: DocumentsService) {}

  @ApiOperation({ summary: 'Create document' })
  @ApiBody({ type: CreateDocumentDto })
  @ApiCreatedResponse({
    description: 'Successfully created',
    type: DocumentDto,
  })
  @Post()
  create(
    @Body() createDocumentDto: CreateDocumentDto,
    @AuthUser() user: UserEntity,
  ): Promise<DocumentDto> {
    return this._documentsService.create(createDocumentDto, user);
  }

  @ApiOperation({ summary: 'Get all documents' })
  @ApiResponse({
    status: 200,
    type: [DocumentDto],
  })
  @Get()
  getAll(@AuthUser() user: UserEntity): Promise<DocumentDto[]> {
    return this._documentsService.getAll(user);
  }

  @ApiOperation({ summary: 'Get document by id' })
  @ApiResponse({
    status: 200,
    type: DocumentDto,
  })
  @ApiNotFoundResponse({
    description: 'Document not found',
  })
  @Get(':id')
  getOne(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: UserEntity,
  ): Promise<DocumentDto> {
    return this._documentsService.getById(id, user);
  }

  @ApiOperation({ summary: 'Update document by id' })
  @ApiResponse({
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Document not found',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @AuthUser() user: UserEntity,
  ): Promise<DocumentDto> {
    return this._documentsService.update(id, updateDocumentDto, user);
  }

  @ApiOperation({ summary: 'Delete document by id' })
  @ApiResponse({
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Document not found',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this._documentsService.remove(+id);
  }
}
