import { FacultyEntity } from '../../faculties/entities/faculty.entity';
import { PositionEntity } from '../../positions/entities/position.entity';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(5, 70)
  username: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(7, 25)
  password: string;

  @ApiProperty({ type: FacultyEntity })
  faculty: FacultyEntity;

  @ApiProperty({ type: PositionEntity })
  position: PositionEntity;
}
