import { FindConditions, Repository } from 'typeorm';
import { DocumentSignatureEntity } from '../entities/document-signature.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SignatureStatus } from '../enums/signature-statuses.enum';
import { DocumentEntity } from '../entities/document.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { SignatureNotFoundException } from '../../../exceptions/signature-not-found.exception';
import { SignatureAlreadyCompletedException } from '../../../exceptions/signature-already-completed.exception';

export class DocumentsSignaturesService {
  constructor(
    @InjectRepository(DocumentSignatureEntity)
    private readonly _documentsSignaturesRepository: Repository<DocumentSignatureEntity>,
  ) {}

  public async createSignature(
    document: DocumentEntity,
    signer: UserEntity,
  ): Promise<DocumentSignatureEntity> {
    const newDocumentSignature = this._documentsSignaturesRepository.create({
      document,
      signer,
    });
    await this._documentsSignaturesRepository.save(newDocumentSignature);

    return newDocumentSignature;
  }

  public async getUserSignaturesToMapDocuments(
    user: UserEntity,
  ): Promise<DocumentSignatureEntity[]> {
    const signatures = await this._documentsSignaturesRepository.find({
      relations: ['document', 'document.creator'],
      where: { signer: user },
    });
    return signatures;
  }

  public async getAllDocumentSignatures(
    document: DocumentEntity,
  ): Promise<DocumentSignatureEntity[]> {
    const signatures = await this._documentsSignaturesRepository.find({
      relations: ['document', 'signer'],
      where: { document },
    });
    return signatures;
  }

  public async getDocumentSignature(
    findData: FindConditions<DocumentSignatureEntity>,
  ): Promise<DocumentSignatureEntity> {
    const signature = await this._documentsSignaturesRepository.findOne({
      where: findData,
      relations: ['document', 'signer'],
    });

    if (!signature) {
      throw new SignatureNotFoundException();
    }

    return signature;
  }

  // This update implementation is related to getting the entire entity
  // in event subscriber
  public async updateSignatureStatus(
    signature: DocumentSignatureEntity,
    status: SignatureStatus,
  ) {
    signature.completedStatus = status;
    signature.isCompleted = true;

    await this._documentsSignaturesRepository.save(signature);
  }

  public async areAllSignaturesCompleted(
    completedSignature: DocumentSignatureEntity,
    document: DocumentEntity,
  ): Promise<boolean> {
    const queryBuilder = this._documentsSignaturesRepository.createQueryBuilder(
      'signatures',
    );

    const incompleteSignaturesNumber = await queryBuilder
      .where('signatures.id != :signature', {
        signature: completedSignature.id,
      })
      .andWhere('signatures.document = :document', { document: document.id })
      .andWhere('signatures.isCompleted = false')
      .getCount();

    return !incompleteSignaturesNumber;
  }

  public isAvailableToInteract(signature: DocumentSignatureEntity) {
    if (signature.isCompleted) {
      throw new SignatureAlreadyCompletedException();
    }
    return true;
  }
}
