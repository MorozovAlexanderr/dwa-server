import { Column, Entity, OneToMany } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { PositionDto } from '../dtos/position.dto';

@Entity({ name: 'positions' })
export class PositionEntity extends AbstractEntity<PositionDto> {
  @Column()
  name: string;

  @Column()
  priority: number;

  @OneToMany(() => UserEntity, (user) => user.position)
  user: UserEntity[];

  dtoClass = PositionDto;
}
