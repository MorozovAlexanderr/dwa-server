import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { PositionDto } from '../dtos/position.dto';
import { OrganizationEntity } from '../../organizations/entities/organization.entity';
import { WorkspaceEntity } from '../../workspaces/entities/workspace.entity';

@Entity({ name: 'positions' })
export class PositionEntity extends AbstractEntity<PositionDto> {
  @Column()
  name: string;

  @Column()
  priority: number;

  @ManyToOne(() => OrganizationEntity, (organization) => organization.positions)
  organization: OrganizationEntity;

  @OneToMany(() => WorkspaceEntity, (workspace) => workspace.position)
  workspaces: WorkspaceEntity[];

  dtoClass = PositionDto;
}
