import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { UserInviteDto } from '../dtos/user-invite.dto';
import { UserEntity } from './user.entity';
import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { OrganizationEntity } from '../../organizations/entities/organization.entity';

@Entity('users_invite')
export class UserInviteEntity extends AbstractEntity<UserInviteDto> {
  @ManyToOne(
    () => OrganizationEntity,
    (organization) => organization.userInvite,
  )
  organization: OrganizationEntity;

  @OneToOne(() => UserEntity, (user) => user.userInvite, { nullable: false })
  @JoinColumn()
  user: UserEntity;

  dtoClass = UserInviteDto;
}
