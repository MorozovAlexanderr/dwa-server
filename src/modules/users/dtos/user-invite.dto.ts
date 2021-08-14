import { AbstractDto } from '../../../common/dtos/abstract.dto';
import { UserInviteEntity } from '../entities/user-invite.entity';
import { UserDto } from './user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { OrganizationDto } from '../../organizations/dtos/organization.dto';

export class UserInviteDto extends AbstractDto {
  @ApiProperty({ type: () => UserDto })
  user: UserDto;

  @ApiProperty({ type: () => OrganizationDto })
  organization: OrganizationDto;

  constructor(userInvite: UserInviteEntity) {
    super(userInvite);
    this.user = userInvite.user;
    this.organization = userInvite.organization;
  }
}
