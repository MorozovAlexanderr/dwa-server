import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { FacultyDto } from '../dtos/faculty.dto';

@Entity({ name: 'faculties' })
export class FacultyEntity extends AbstractEntity<FacultyDto> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => UserEntity, (user) => user.faculty)
  user: UserEntity[];

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  updatedAt: Date;

  dtoClass = FacultyDto;
}
