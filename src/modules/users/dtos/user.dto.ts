import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from '../../../common/dtos/abstract.dto';
import { UserRole } from '../../../common/enums/roles.enum';
import { UserEntity } from '../entities/user.entity';
import { PositionDto } from '../../positions/dtos/position.dto';
import { OrganizationDto } from '../../organizations/dtos/organization.dto';
import { StructureDto } from '../../structures/dto/structure.dto';

export class UserDto extends AbstractDto {
  @ApiProperty()
  readonly username: string;

  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly isActive: boolean;

  @ApiProperty({ type: OrganizationDto })
  readonly organization: OrganizationDto;

  @ApiProperty({ type: StructureDto })
  readonly structure: StructureDto;

  @ApiProperty({ type: PositionDto })
  readonly position: PositionDto;

  @ApiProperty({ enum: ['Admin', 'User'] })
  readonly role: UserRole;

  constructor(user: UserEntity) {
    super(user);
    this.username = user.username;
    this.email = user.email;
    this.isActive = user.isActive;
    this.organization = user.organization?.toDto();
    this.structure = user.structure?.toDto();
    this.position = user.position?.toDto();
    this.role = user.role;
  }
}
