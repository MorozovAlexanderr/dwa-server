import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { DocumentDto } from '../dto/document.dto';
import { Column, CreateDateColumn, Entity, ManyToOne } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

@Entity({ name: 'documents' })
export class DocumentEntity extends AbstractEntity<DocumentDto> {
  @Column()
  name: string;

  @Column()
  headers: string;

  @Column({ type: 'text' })
  description: string;

  @Column('simple-array')
  signerIds: number[];

  @ManyToOne(() => UserEntity, (creator) => creator.documents)
  creator: UserEntity;

  @Column({ default: false })
  isReady: boolean;

  @CreateDateColumn({
    type: 'timestamp',
  })
  expiresAt: Date;

  dtoClass = DocumentDto;
}
