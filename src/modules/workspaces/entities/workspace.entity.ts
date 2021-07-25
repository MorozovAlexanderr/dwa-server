import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { WorkspaceDto } from '../dto/workspace.dto';
import { Column, Entity, ManyToOne } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { OrganizationEntity } from '../../organizations/entities/organization.entity';
import { StructureEntity } from '../../structures/entities/structure.entity';
import { PositionEntity } from '../../positions/entities/position.entity';
import { UserWorkspaceRole } from '../../../common/enums/workspace-roles.enum';

@Entity('workspaces')
export class WorkspaceEntity extends AbstractEntity<WorkspaceDto> {
  @ManyToOne(() => UserEntity, (user) => user.workspaces)
  user: UserEntity;

  @ManyToOne(
    () => OrganizationEntity,
    (organization) => organization.workspaces,
  )
  organization: OrganizationEntity;

  @ManyToOne(() => StructureEntity, (structure) => structure.workspaces)
  structure: StructureEntity;

  @ManyToOne(() => PositionEntity, (position) => position.workspaces)
  position: PositionEntity;

  @Column({ default: false })
  isCurrent: boolean;

  @Column({
    type: 'enum',
    enum: UserWorkspaceRole,
    default: UserWorkspaceRole.MEMBER,
  })
  accessLevel: UserWorkspaceRole;

  dtoClass = WorkspaceDto;
}
