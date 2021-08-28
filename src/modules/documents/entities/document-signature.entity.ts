import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { DocumentSignatureDto } from '../dto/document-signature.dto';
import { Column, Entity, ManyToOne } from 'typeorm';
import { DocumentEntity } from './document.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { SignatureStatus } from '../enums/signature-statuses.enum';

@Entity('documents_signatures')
export class DocumentSignatureEntity extends AbstractEntity<DocumentSignatureDto> {
  @ManyToOne(() => DocumentEntity, (document) => document.documentSignatures, {
    onDelete: 'CASCADE',
  })
  document: DocumentEntity;

  @ManyToOne(() => UserEntity, (signer) => signer.documentSignatures)
  signer: UserEntity;

  @Column({
    type: 'enum',
    enum: SignatureStatus,
    nullable: true,
  })
  completedStatus: SignatureStatus;

  @Column({ default: false })
  isCompleted: boolean;

  dtoClass = DocumentSignatureDto;
}
