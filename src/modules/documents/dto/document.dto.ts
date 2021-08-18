import { AbstractDto } from '../../../common/dtos/abstract.dto';
import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../users/dtos/user.dto';
import { DocumentEntity } from '../entities/document.entity';
import { OrganizationDto } from '../../organizations/dtos/organization.dto';

export class DocumentDto extends AbstractDto {
  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly description: string;

  @ApiProperty()
  readonly signerIds: number[];

  @ApiProperty({ type: UserDto })
  readonly creator: UserDto;

  @ApiProperty({ type: OrganizationDto })
  readonly organization: OrganizationDto;

  @ApiProperty()
  readonly isReady: boolean;

  @ApiProperty()
  readonly expiresAt: Date;

  constructor(document: DocumentEntity) {
    super(document);
    this.name = document.name;
    this.description = document.description;
    this.signerIds = document.signerIds;
    this.creator = document.creator;
    this.organization = document.organization;
    this.isReady = document.isReady;
    this.expiresAt = document.expiresAt;
  }
}
