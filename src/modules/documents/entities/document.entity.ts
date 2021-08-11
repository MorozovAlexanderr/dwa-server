import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { DocumentDto } from '../dto/document.dto';
import { Column, CreateDateColumn, Entity, ManyToOne } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { OrganizationEntity } from '../../organizations/entities/organization.entity';

@Entity({ name: 'documents' })
export class DocumentEntity extends AbstractEntity<DocumentDto> {
  @Column()
  name: string;

  @Column({ type: 'text' })
  content: string;

  @Column('simple-array')
  signerIds: number[];

  @ManyToOne(() => UserEntity, (creator) => creator.documents)
  creator: UserEntity;

  @ManyToOne(() => OrganizationEntity, (organization) => organization.documents)
  organization: OrganizationEntity;

  @Column({ default: false })
  isReady: boolean;

  @CreateDateColumn({
    type: 'timestamp',
  })
  expiresAt: Date;

  dtoClass = DocumentDto;
}
