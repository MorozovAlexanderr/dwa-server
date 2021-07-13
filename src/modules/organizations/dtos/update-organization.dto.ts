import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateOrganizationDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly name?: string;
}
