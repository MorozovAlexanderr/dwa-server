import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrganizationDto } from '../../organizations/dtos/organization.dto';

export class CreatePositionDto {
  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiProperty({ type: OrganizationDto })
  readonly organization: OrganizationDto;

  @ApiProperty()
  @IsNumber()
  readonly priority: number;
}
