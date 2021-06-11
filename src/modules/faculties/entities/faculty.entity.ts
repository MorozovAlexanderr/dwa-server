import { Column, Entity, OneToMany } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { FacultyDto } from '../dtos/faculty.dto';

@Entity({ name: 'faculties' })
export class FacultyEntity extends AbstractEntity<FacultyDto> {
  @Column()
  name: string;

  @OneToMany(() => UserEntity, (user) => user.faculty)
  user: UserEntity[];

  dtoClass = FacultyDto;
}
