import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { OrganizationDto } from '../../organizations/dtos/organization.dto';
import { PositionDto } from '../../positions/dtos/position.dto';
import { StructureDto } from '../../structures/dto/structure.dto';

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

  @ApiProperty({ type: OrganizationDto })
  readonly organization: OrganizationDto;

  @ApiProperty({ type: StructureDto })
  readonly structure: StructureDto;

  @ApiProperty({ type: PositionDto })
  readonly position: PositionDto;
}
