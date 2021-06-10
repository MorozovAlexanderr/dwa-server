import { AbstractDto } from '../../../common/dtos/abstract.dto';
import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../users/dtos/user.dto';
import { DocumentEntity } from '../entities/document.entity';

export class DocumentDto extends AbstractDto {
  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly headers: string;

  @ApiProperty()
  readonly description: string;

  @ApiProperty()
  readonly signerIds: number[];

  @ApiProperty()
  readonly creator: UserDto;

  @ApiProperty()
  readonly isReady: boolean;

  @ApiProperty()
  readonly expiresAt: Date;

  constructor(document: DocumentEntity) {
    super(document);
    this.name = document.name;
    this.headers = document.headers;
    this.description = document.description;
    this.signerIds = document.signerIds;
    this.creator = document.creator;
    this.isReady = document.isReady;
    this.expiresAt = document.expiresAt;
  }
}
