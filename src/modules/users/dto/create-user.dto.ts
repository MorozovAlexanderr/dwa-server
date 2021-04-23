import { Faculty } from '../../faculties/entities/faculty.entity';
import { Position } from '../../positions/entities/position.entity';
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

  @ApiProperty({ type: Faculty })
  faculty: Faculty;

  @ApiProperty({ type: Position })
  position: Position;
}
