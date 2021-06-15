import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { PositionDto } from '../dtos/position.dto';
import { OrganizationEntity } from '../../organizations/entities/organization.entity';

@Entity({ name: 'positions' })
export class PositionEntity extends AbstractEntity<PositionDto> {
  @Column()
  name: string;

  @Column()
  priority: number;

  @ManyToOne(
    () => OrganizationEntity,
    (organization) => organization.positions,
    { eager: true },
  )
  organization: OrganizationEntity;

  @OneToMany(() => UserEntity, (user) => user.position)
  users: UserEntity[];

  dtoClass = PositionDto;
}
