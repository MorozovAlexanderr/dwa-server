import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFacultyDto {
  @ApiProperty()
  @IsString()
  readonly name: string;
}
