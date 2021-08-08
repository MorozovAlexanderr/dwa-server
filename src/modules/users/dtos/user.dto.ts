import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from '../../../common/dtos/abstract.dto';
import { UserRole } from '../../../common/enums/roles.enum';
import { UserEntity } from '../entities/user.entity';
import { OrganizationDto } from '../../organizations/dtos/organization.dto';

export class UserDto extends AbstractDto {
  @ApiProperty()
  readonly firstName: string;

  @ApiProperty()
  readonly secondName: string;

  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly isActive: boolean;

  @ApiProperty({ type: OrganizationDto })
  readonly organization: OrganizationDto;

  @ApiProperty({ enum: UserRole })
  readonly role: UserRole;

  constructor(user: UserEntity) {
    super(user);
    this.firstName = user.firstName;
    this.secondName = user.secondName;
    this.email = user.email;
    this.isActive = user.isActive;
    this.organization = user.organization;
    this.role = user.role;
  }
}
