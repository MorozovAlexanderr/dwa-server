import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { DocumentDto } from '../dto/document.dto';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { OrganizationEntity } from '../../organizations/entities/organization.entity';
import { DocumentSignatureEntity } from './document-signature.entity';

@Entity({ name: 'documents' })
export class DocumentEntity extends AbstractEntity<DocumentDto> {
  @Column()
  name: string;

  @Column()
  filePath: string;

  @Column({
    nullable: true,
  })
  description?: string;

  @ManyToOne(() => UserEntity, (creator) => creator.documents)
  creator: UserEntity;

  @ManyToOne(() => OrganizationEntity, (organization) => organization.documents)
  organization: OrganizationEntity;

  @OneToMany(
    () => DocumentSignatureEntity,
    (documentSignatures) => documentSignatures.document,
  )
  documentSignatures: DocumentSignatureEntity[];

  @Column({ default: false })
  isReady: boolean;

  @CreateDateColumn({
    type: 'timestamp',
  })
  expiresAt: Date;

  dtoClass = DocumentDto;
}
