import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from '../../../common/dtos/abstract.dto';
import { UserRole } from '../../../common/enums/roles.enum';
import { UserEntity } from '../entities/user.entity';
import { PositionDto } from '../../positions/dtos/position.dto';
import { FacultyDto } from '../../faculties/dtos/faculty.dto';

export class UserDto extends AbstractDto {
  @ApiProperty()
  readonly username: string;

  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly isActive: boolean;

  @ApiProperty()
  readonly faculty: FacultyDto;

  @ApiProperty()
  readonly position: PositionDto;

  @ApiProperty()
  readonly role: UserRole;

  constructor(user: UserEntity) {
    super(user);
    this.username = user.username;
    this.email = user.email;
    this.isActive = user.isActive;
    this.faculty = user.faculty.toDto();
    this.position = user.position.toDto();
    this.role = user.role;
  }
}
