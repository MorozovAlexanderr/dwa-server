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

  // This field is only used for valid swagger documentation
  @ApiProperty({ type: 'file' })
  readonly file: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly description?: string;

  @ApiProperty({ name: 'signerIds[]' })
  @IsArray()
  @IsNotEmpty()
  readonly signerIds: string[];

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  readonly expiresAt: Date;
}
