import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { FacultyEntity } from '../../faculties/entities/faculty.entity';
import { PositionEntity } from '../../positions/entities/position.entity';
import { UserRole } from '../../../common/enums/roles.enum';
import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { UserDto } from '../dtos/user.dto';
import { DocumentEntity } from '../../documents/entities/document.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity<UserDto> {
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

  @OneToMany(() => DocumentEntity, (document) => document.creator)
  document: DocumentEntity[];

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  dtoClass = UserDto;
}
