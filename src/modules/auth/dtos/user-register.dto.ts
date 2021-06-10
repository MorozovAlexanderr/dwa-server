import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { FacultyDto } from '../../faculties/dtos/faculty.dto';
import { PositionDto } from '../../positions/dtos/position.dto';

export class RegisterUserDto {
  @ApiProperty({ minLength: 5, maxLength: 70 })
  @IsString()
  @IsNotEmpty()
  @Length(5, 70)
  readonly username: string;

  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ minLength: 7, maxLength: 25 })
  @IsString()
  @IsNotEmpty()
  @Length(7, 25)
  readonly password: string;

  @ApiProperty({ type: FacultyDto })
  readonly faculty: FacultyDto;

  @ApiProperty({ type: PositionDto })
  readonly position: PositionDto;
}
