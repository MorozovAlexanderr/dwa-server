import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { StructureDto } from './structure.dto';
import { OrganizationDto } from '../../organizations/dtos/organization.dto';

export class CreateStructureDto {
  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiProperty({ type: OrganizationDto })
  readonly organization: OrganizationDto;

  @ApiProperty({ type: StructureDto })
  @IsOptional()
  readonly parent?: StructureDto;
}
