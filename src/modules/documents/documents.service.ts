import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentEntity } from './entities/document.entity';
import { Repository } from 'typeorm';
import { DocumentDto } from './dto/document.dto';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(DocumentEntity)
    private documentsRepository: Repository<DocumentEntity>,
  ) {}

  async create(
    createDocumentDto: CreateDocumentDto,
    user: UserEntity,
  ): Promise<DocumentDto> {
    const newDocument = this.documentsRepository.create({
      creator: user,
      ...createDocumentDto,
    });
    await this.documentsRepository.save(newDocument);
    return newDocument.toDto();
  }

  async getAll(user: UserEntity): Promise<DocumentDto[]> {
    const documents = await this.documentsRepository.find({ creator: user });
    return documents.map((d) => d.toDto());
  }

  async getById(id: number, user: UserEntity): Promise<DocumentDto> {
    const document = await this.documentsRepository.findOne({
      id,
      creator: user,
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
  ) {
    if (updateDocumentDto.name) {
      await this.documentsRepository.update(id, {
        name: updateDocumentDto.name,
      });
    }

    if (updateDocumentDto.headers) {
      await this.documentsRepository.update(id, {
        headers: updateDocumentDto.headers,
      });
    }

    if (updateDocumentDto.description) {
      await this.documentsRepository.update(id, {
        description: updateDocumentDto.description,
      });
    }

    if (updateDocumentDto.expiresAt) {
      await this.documentsRepository.update(id, {
        expiresAt: updateDocumentDto.expiresAt,
      });
    }

    return this.getById(id, user);
  }

  async remove(id: number) {
    await this.documentsRepository.delete(id);
  }
}
