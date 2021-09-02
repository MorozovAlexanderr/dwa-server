import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { UpdateDocumentDto } from '../dto/update-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentEntity } from '../entities/document.entity';
import { Connection, FindConditions, Repository } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { DocumentNotFoundException } from '../../../exceptions/document-not-found.exception';
import { UtilsService } from '../../../utils/utils.service';
import { DocumentsSignaturesService } from './documents-signatures.service';
import { SignatureStatus } from '../enums/signature-statuses.enum';
import { UsersService } from '../../users/services/users.service';
import { DocumentSignatureEntity } from '../entities/document-signature.entity';
import { DocumentDeletionFailedException } from '../../../exceptions/document-deletion-failed.exception';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(DocumentEntity)
    private readonly _documentsRepository: Repository<DocumentEntity>,
    private readonly _documentsSignaturesService: DocumentsSignaturesService,
    private readonly _usersService: UsersService,
    private readonly _connection: Connection,
  ) {}

  public async createDocument(
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

    const { signerIds } = createDocumentDto;

    await Promise.all(
      signerIds.map(async (signerId) => {
        const signer = await this._usersService.getUser({ uuid: signerId });

        await this._documentsSignaturesService.createSignature(
          newDocument,
          signer,
        );
      }),
    );

    return newDocument;
  }

  public async processDocument(
    uuid: string,
    user: UserEntity,
    status: SignatureStatus,
  ): Promise<DocumentEntity> {
    const document = await this.getDocument({ uuid });

    const signature = await this._documentsSignaturesService.getDocumentSignature(
      {
        document,
        signer: user,
      },
    );

    this._documentsSignaturesService.isAvailableToInteract(signature);

    await this._documentsSignaturesService.updateSignatureStatus(
      signature,
      status,
    );

    return this.getDocument({ uuid });
  }

  public async getCreatedDocuments(
    user: UserEntity,
  ): Promise<DocumentEntity[]> {
    const documents = await this._documentsRepository.find({
      relations: ['creator'],
      where: {
        creator: user,
      },
    });
    return documents;
  }

  public async getSigningDocuments(
    user: UserEntity,
  ): Promise<DocumentEntity[]> {
    const signatures = await this._documentsSignaturesService.getUserSignaturesToMapDocuments(
      user,
    );
    return signatures.map((s) => s.document);
  }

  public async getDocument(
    findData: FindConditions<DocumentEntity>,
  ): Promise<DocumentEntity | undefined> {
    const document = await this._documentsRepository.findOne({
      relations: ['creator'],
      where: findData,
    });
    if (!document) {
      throw new DocumentNotFoundException();
    }
    return document;
  }

  public async isDocumentAccessibleToUser(
    user: UserEntity,
    uuid: string,
  ): Promise<boolean> {
    const document = await this.getDocument({ uuid });
    const signatures = await this._documentsSignaturesService.getAllDocumentSignatures(
      document,
    );

    const isSigner = signatures.some((s) => s.signer.id === user.id);

    return document.creator.id === user.id || isSigner;
  }

  public async getDocumentSignatures(
    uuid: string,
  ): Promise<DocumentSignatureEntity[] | undefined> {
    const document = await this.getDocument({ uuid });
    const signatures = await this._documentsSignaturesService.getAllDocumentSignatures(
      document,
    );

    return signatures;
  }

  public async setDocFinishedStatus(document: DocumentEntity) {
    await this._documentsRepository.update(document.id, { isReady: true });
  }

  public async updateDocumentData(
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

    return this.getDocument({ uuid, creator: user });
  }

  public async removeDocument(uuid: string, user: UserEntity): Promise<void> {
    const queryRunner = this._connection.createQueryRunner();

    const document = await this.getDocument({ uuid, creator: user });

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
      throw new DocumentDeletionFailedException(error.message);
    } finally {
      await queryRunner.release();
    }
  }
}
