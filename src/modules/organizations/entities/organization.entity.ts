import { Column, Entity, OneToMany } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { OrganizationDto } from '../dtos/organization.dto';
import { StructureEntity } from '../../structures/entities/structure.entity';
import { PositionEntity } from '../../positions/entities/position.entity';
import { DocumentEntity } from '../../documents/entities/document.entity';

@Entity({ name: 'organizations' })
export class OrganizationEntity extends AbstractEntity<OrganizationDto> {
  @Column()
  name: string;

  @OneToMany(() => UserEntity, (user) => user.organization)
  users: UserEntity[];

  @OneToMany(() => DocumentEntity, (document) => document.organization)
  documents: DocumentEntity[];

  @OneToMany(() => StructureEntity, (structure) => structure.organization)
  structures: StructureEntity[];

  @OneToMany(() => PositionEntity, (position) => position.organization)
  positions: PositionEntity[];

  dtoClass = OrganizationDto;
}
