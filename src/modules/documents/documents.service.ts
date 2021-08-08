import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentEntity } from './entities/document.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { DocumentNotFoundException } from '../../exceptions/document-not-found.exception';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(DocumentEntity)
    private readonly _documentsRepository: Repository<DocumentEntity>,
  ) {}

  async create(
    createDocumentDto: CreateDocumentDto,
    user: UserEntity,
  ): Promise<DocumentEntity> {
    const newDocument = this._documentsRepository.create({
      creator: user,
      organization: user.organization,
      ...createDocumentDto,
    });
    await this._documentsRepository.save(newDocument);
    return newDocument;
  }

  async getAll(user: UserEntity): Promise<DocumentEntity[]> {
    const documents = await this._documentsRepository.find({
      creator: user,
      organization: user.organization,
    });
    return documents;
  }

  async getById(
    id: number,
    user: UserEntity,
  ): Promise<DocumentEntity | undefined> {
    const document = await this._documentsRepository.findOne({
      id,
      creator: user,
      organization: user.organization,
    });
    if (!document) {
      throw new DocumentNotFoundException();
    }
    return document;
  }

  async update(
    id: number,
    updateDocumentDto: UpdateDocumentDto,
    user: UserEntity,
  ): Promise<DocumentEntity> {
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
