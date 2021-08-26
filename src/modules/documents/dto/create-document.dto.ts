import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateDocumentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly description?: string;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  readonly signerIds: string[];

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  readonly expiresAt: Date;
}
