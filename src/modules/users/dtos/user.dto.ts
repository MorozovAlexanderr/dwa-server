import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AbstractDto } from '../../../common/dtos/abstract.dto';
import { UserEntity } from '../entities/user.entity';
import { UserWorkspaceDto } from './user-workspace.dto';
import { IsOptional } from 'class-validator';
import { AvatarColor } from '../enums/avatar-colors.enum';

export class UserDto extends AbstractDto {
  @ApiProperty()
  readonly firstName: string;

  @ApiProperty()
  readonly secondName: string;

  @ApiProperty()
  readonly email: string;

  @ApiPropertyOptional({ type: () => UserWorkspaceDto })
  @IsOptional()
  readonly userWorkspace?: UserWorkspaceDto;

  @ApiProperty({ enum: AvatarColor })
  readonly avatarColor: AvatarColor;

  @ApiProperty()
  readonly isActive: boolean;

  constructor(user: UserEntity) {
    super(user);
    this.firstName = user.firstName;
    this.secondName = user.secondName;
    this.email = user.email;
    this.userWorkspace = user.userWorkspace?.toDto();
    this.avatarColor = user.avatarColor;
    this.isActive = user.isActive;
  }
}
