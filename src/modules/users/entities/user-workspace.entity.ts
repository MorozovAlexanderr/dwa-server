import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { UserWorkspaceDto } from '../dtos/user-workspace.dto';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { OrganizationDto } from '../../organizations/dtos/organization.dto';
import { OrganizationEntity } from '../../organizations/entities/organization.entity';
import { UserWorkspaceRole } from '../../../common/enums/workspace-roles.enum';
import { UserEntity } from './user.entity';

@Entity('users_workspace')
export class UserWorkspaceEntity extends AbstractEntity<UserWorkspaceDto> {
  @ManyToOne(
    () => OrganizationEntity,
    (organization) => organization.userWorkspace,
  )
  organization: OrganizationDto;

  @OneToOne(() => UserEntity, (user) => user.userWorkspace, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity;

  @Column({
    type: 'enum',
    enum: UserWorkspaceRole,
    default: UserWorkspaceRole.MEMBER,
  })
  accessLevel: UserWorkspaceRole;

  dtoClass = UserWorkspaceDto;
}
