import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentEntity } from './entities/document.entity';
import { Repository } from 'typeorm';
import { DocumentDto } from './dto/document.dto';
import { UserEntity } from '../users/entities/user.entity';
import { WorkspacesService } from '../workspaces/workspaces.service';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(DocumentEntity)
    private readonly _documentsRepository: Repository<DocumentEntity>,
    private readonly _workspacesService: WorkspacesService,
  ) {}

  async create(
    createDocumentDto: CreateDocumentDto,
    user: UserEntity,
  ): Promise<DocumentDto> {
    const { organization } = await this._workspacesService.getCurrent(user);
    const newDocument = this._documentsRepository.create({
      creator: user,
      organization,
      ...createDocumentDto,
    });
    await this._documentsRepository.save(newDocument);
    return newDocument.toDto();
  }

  async getAll(user: UserEntity): Promise<DocumentDto[]> {
    const { organization } = await this._workspacesService.getCurrent(user);
    const documents = await this._documentsRepository.find({
      creator: user,
      organization,
    });
    return documents.map((d) => d.toDto());
  }

  async getById(
    id: number,
    user: UserEntity,
  ): Promise<DocumentDto | undefined> {
    const { organization } = await this._workspacesService.getCurrent(user);
    const document = await this._documentsRepository.findOne({
      id,
      creator: user,
      organization,
    });
    if (document) {
      return document.toDto();
    }
    throw new HttpException(
      'Document with this id does not exists',
      HttpStatus.NOT_FOUND,
    );
  }

  async update(
    id: number,
    updateDocumentDto: UpdateDocumentDto,
    user: UserEntity,
  ): Promise<DocumentDto> {
    if (updateDocumentDto.name) {
      await this._documentsRepository.update(id, {
        name: updateDocumentDto.name,
      });
    }

    if (updateDocumentDto.headers) {
      await this._documentsRepository.update(id, {
        headers: updateDocumentDto.headers,
      });
    }

    if (updateDocumentDto.description) {
      await this._documentsRepository.update(id, {
        description: updateDocumentDto.description,
      });
    }

    if (updateDocumentDto.expiresAt) {
      await this._documentsRepository.update(id, {
        expiresAt: updateDocumentDto.expiresAt,
      });
    }

    return this.getById(id, user);
  }

  async remove(id: number) {
    await this._documentsRepository.delete(id);
  }
}
