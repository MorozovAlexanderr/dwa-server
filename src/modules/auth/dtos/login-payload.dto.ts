import { ApiProperty } from '@nestjs/swagger';

export class LoginPayloadDto {
  @ApiProperty()
  readonly accessToken: string;

  @ApiProperty()
  readonly refreshToken: string;
}
