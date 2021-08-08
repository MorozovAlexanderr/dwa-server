import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ minLength: 2, maxLength: 70 })
  @IsString()
  @IsNotEmpty()
  @Length(2, 70)
  readonly firstName: string;

  @ApiProperty({ minLength: 2, maxLength: 70 })
  @IsString()
  @IsNotEmpty()
  @Length(2, 70)
  readonly secondName: string;

  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ minLength: 7, maxLength: 25 })
  @IsString()
  @IsNotEmpty()
  @Length(7, 25)
  readonly password: string;
}
