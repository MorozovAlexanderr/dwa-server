import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ minLength: 2, maxLength: 70 })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly firstName?: string;

  @ApiPropertyOptional({ minLength: 2, maxLength: 70 })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly secondName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @ApiPropertyOptional({ minLength: 7, maxLength: 25 })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Length(7, 25)
  readonly password?: string;
}
