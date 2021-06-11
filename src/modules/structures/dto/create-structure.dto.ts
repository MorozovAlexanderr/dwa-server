import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { StructureDto } from './structure.dto';

export class CreateStructureDto {
  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiProperty({ type: StructureDto })
  @IsOptional()
  readonly parent?: StructureDto;
}
