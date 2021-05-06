import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { FacultyEntity } from '../../faculties/entities/faculty.entity';
import { PositionEntity } from '../../positions/entities/position.entity';
import { UserRole } from '../../../common/enums/roles.enum';
import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { UserDto } from '../dtos/user.dto';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity<UserDto> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    nullable: true,
  })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => FacultyEntity, (faculty) => faculty.user, {
    eager: true,
  })
  faculty: FacultyEntity;

  @ManyToOne(() => PositionEntity, (position) => position.user, {
    eager: true,
  })
  position: PositionEntity;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  updatedAt: Date;

  dtoClass = UserDto;
}
