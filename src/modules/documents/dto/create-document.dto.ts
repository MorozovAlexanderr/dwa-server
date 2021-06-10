import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateDocumentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  headers: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  signerIds: number[];

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  expiresAt: Date;
}
