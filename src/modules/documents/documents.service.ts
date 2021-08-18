import { Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentEntity } from './entities/document.entity';
import { Connection, Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { DocumentNotFoundException } from '../../exceptions/document-not-found.exception';
import { UtilsService } from '../../utils/utils.service';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(DocumentEntity)
    private readonly _documentsRepository: Repository<DocumentEntity>,
    private readonly _connection: Connection,
  ) {}

  async create(
    filePath: string,
    createDocumentDto: CreateDocumentDto,
    user: UserEntity,
  ): Promise<DocumentEntity> {
    const newDocument = this._documentsRepository.create({
      creator: user,
      organization: user.userWorkspace.organization,
      filePath,
      ...createDocumentDto,
    });
    await this._documentsRepository.save(newDocument);
    return newDocument;
  }

  async getAll(user: UserEntity): Promise<DocumentEntity[]> {
    const documents = await this._documentsRepository.find({
      relations: ['creator'],
      where: {
        creator: user,
      },
    });
    return documents;
  }

  async getDocument(
    uuid: string,
    user: UserEntity,
  ): Promise<DocumentEntity | undefined> {
    const document = await this._documentsRepository.findOne({
      relations: ['creator'],
      where: {
        uuid,
        creator: user,
      },
    });
    if (!document) {
      throw new DocumentNotFoundException();
    }
    return document;
  }

  async update(
    uuid: string,
    updateDocumentDto: UpdateDocumentDto,
    user: UserEntity,
  ): Promise<DocumentEntity> {
    if (updateDocumentDto.name) {
      await this._documentsRepository.update(
        {
          uuid,
          creator: user,
        },
        {
          name: updateDocumentDto.name,
        },
      );
    }

    if (updateDocumentDto.description) {
      await this._documentsRepository.update(
        {
          uuid,
          creator: user,
        },
        {
          description: updateDocumentDto.description,
        },
      );
    }

    if (updateDocumentDto.expiresAt) {
      await this._documentsRepository.update(
        {
          uuid,
          creator: user,
        },
        {
          expiresAt: updateDocumentDto.expiresAt,
        },
      );
    }

    return this.getDocument(uuid, user);
  }

  // TODO: add exception throwing to catch block

  async remove(uuid: string, user: UserEntity): Promise<void> {
    const queryRunner = this._connection.createQueryRunner();

    const document = await this.getDocument(uuid, user);

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(DocumentEntity, {
        id: document.id,
        creator: user,
      });
      await UtilsService.deleteFile(document.filePath);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
