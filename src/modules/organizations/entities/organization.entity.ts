import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { OrganizationDto } from '../dtos/organization.dto';
import { DocumentEntity } from '../../documents/entities/document.entity';
import { UserWorkspaceEntity } from '../../users/entities/user-workspace.entity';

@Entity({ name: 'organizations' })
export class OrganizationEntity extends AbstractEntity<OrganizationDto> {
  @Column()
  name: string;

  @OneToMany(() => DocumentEntity, (document) => document.organization)
  documents: DocumentEntity[];

  @OneToMany(
    () => UserWorkspaceEntity,
    (userWorkspace) => userWorkspace.organization,
  )
  userWorkspace: UserWorkspaceEntity[];

  dtoClass = OrganizationDto;
}
