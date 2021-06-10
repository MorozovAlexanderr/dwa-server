import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { DocumentDto } from '../dto/document.dto';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

@Entity({ name: 'documents' })
export class DocumentEntity extends AbstractEntity<DocumentDto> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  headers: string;

  @Column({ type: 'text' })
  description: string;

  @Column('simple-array')
  signerIds: number[];

  @ManyToOne(() => UserEntity, (creator) => creator.document)
  creator: UserEntity;

  @Column({ default: false })
  isReady: boolean;

  @CreateDateColumn({
    type: 'timestamp',
  })
  expiresAt: Date;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  updatedAt: Date;

  dtoClass = DocumentDto;
}
