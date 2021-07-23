import { Column, Entity, OneToMany } from 'typeorm';
import { UserRole } from '../../../common/enums/roles.enum';
import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { UserDto } from '../dtos/user.dto';
import { DocumentEntity } from '../../documents/entities/document.entity';
import { Exclude } from 'class-transformer';
import { WorkspaceEntity } from '../../workspaces/entities/workspace.entity';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity<UserDto> {
  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    nullable: true,
  })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => WorkspaceEntity, (workspace) => workspace.user)
  workspaces: WorkspaceEntity[];

  @OneToMany(() => DocumentEntity, (document) => document.creator)
  documents: DocumentEntity[];

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  dtoClass = UserDto;
}
