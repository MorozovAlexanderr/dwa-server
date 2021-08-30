import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { UserDto } from '../dtos/user.dto';
import { DocumentEntity } from '../../documents/entities/document.entity';
import { Exclude } from 'class-transformer';
import { UserWorkspaceEntity } from './user-workspace.entity';
import { UserInviteEntity } from './user-invite.entity';
import { DocumentSignatureEntity } from '../../documents/entities/document-signature.entity';
import { AvatarColor } from '../enums/avatar-colors.enum';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity<UserDto> {
  @Column()
  firstName: string;

  @Column()
  secondName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    nullable: true,
  })
  @Exclude()
  currentHashedRefreshToken?: string;

  @Column({ type: 'enum', enum: AvatarColor, nullable: false })
  avatarColor: AvatarColor;

  @Column({ default: true })
  isActive: boolean;

  @OneToOne(() => UserWorkspaceEntity, (userWorkspace) => userWorkspace.user)
  userWorkspace: UserWorkspaceEntity;

  @OneToOne(() => UserInviteEntity, (userInvite) => userInvite.user)
  userInvite: UserInviteEntity;

  @OneToMany(() => DocumentEntity, (document) => document.creator)
  documents: DocumentEntity[];

  @OneToMany(
    () => DocumentSignatureEntity,
    (documentSignature) => documentSignature.signer,
  )
  documentSignatures: DocumentSignatureEntity[];

  dtoClass = UserDto;
}
