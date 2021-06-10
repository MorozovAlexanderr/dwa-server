import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from '../../../common/dtos/abstract.dto';
import { FacultyEntity } from '../entities/faculty.entity';

export class FacultyDto extends AbstractDto {
  @ApiProperty()
  readonly name: string;

  constructor(faculty: FacultyEntity) {
    super(faculty);
    this.name = faculty.name;
  }
}
