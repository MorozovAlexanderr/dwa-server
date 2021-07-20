import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../users/dtos/user.dto';

export class LoginPayloadDto {
  @ApiProperty()
  readonly accessToken: string;

  @ApiProperty()
  readonly refreshToken: string;

  @ApiProperty()
  readonly user: UserDto;
}
