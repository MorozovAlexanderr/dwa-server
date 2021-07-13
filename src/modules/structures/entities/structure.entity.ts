import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { StructureDto } from '../dto/structure.dto';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { OrganizationEntity } from '../../organizations/entities/organization.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('structures')
@Tree('closure-table')
export class StructureEntity extends AbstractEntity<StructureDto> {
  @Column()
  name: string;

  @TreeParent({ onDelete: 'CASCADE' })
  parent: StructureEntity;

  @TreeChildren()
  children: StructureEntity[];

  @ManyToOne(
    () => OrganizationEntity,
    (organization) => organization.structures,
    {
      eager: true,
    },
  )
  organization: OrganizationEntity;

  @OneToMany(() => UserEntity, (user) => user.structure)
  users: UserEntity[];

  dtoClass = StructureDto;
}