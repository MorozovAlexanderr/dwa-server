import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateDocumentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly content: string;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  readonly signerIds: number[];

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  readonly expiresAt: Date;
}
