import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { OrganizationEntity } from '../../organizations/entities/organization.entity';
import { PositionEntity } from '../../positions/entities/position.entity';
import { UserRole } from '../../../common/enums/roles.enum';
import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { UserDto } from '../dtos/user.dto';
import { DocumentEntity } from '../../documents/entities/document.entity';
import { Exclude } from 'class-transformer';
import { StructureEntity } from '../../structures/entities/structure.entity';

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

  @ManyToOne(() => OrganizationEntity, (organization) => organization.users, {
    eager: true,
  })
  organization: OrganizationEntity;

  @ManyToOne(() => StructureEntity, (structure) => structure.users, {
    eager: true,
  })
  structure: StructureEntity;

  @ManyToOne(() => PositionEntity, (position) => position.users, {
    eager: true,
  })
  position: PositionEntity;

  @OneToMany(() => DocumentEntity, (document) => document.creator)
  documents: DocumentEntity[];

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  dtoClass = UserDto;
}
