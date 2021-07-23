import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from '../../../common/dtos/abstract.dto';
import { UserRole } from '../../../common/enums/roles.enum';
import { UserEntity } from '../entities/user.entity';

export class UserDto extends AbstractDto {
  @ApiProperty()
  readonly username: string;

  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly isActive: boolean;

  @ApiProperty({ enum: ['Admin', 'User'] })
  readonly role: UserRole;

  constructor(user: UserEntity) {
    super(user);
    this.username = user.username;
    this.email = user.email;
    this.isActive = user.isActive;
    this.role = user.role;
  }
}
