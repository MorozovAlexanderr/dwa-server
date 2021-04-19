import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { Faculty } from '../../faculties/entities/faculty.entity';
import { Role } from '../../roles/entities/role.entity';

export class UserRegisterDto {
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

  @ApiProperty({ type: Role })
  role: Role;
}
