import { AbstractDto } from '../../../common/dtos/abstract.dto';
import { DocumentSignatureEntity } from '../entities/document-signature.entity';
import { DocumentDto } from './document.dto';
import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../users/dtos/user.dto';
import { SignatureStatus } from '../enums/signature-statuses.enum';

export class DocumentSignatureDto extends AbstractDto {
  @ApiProperty({ type: DocumentDto })
  readonly document: DocumentDto;

  @ApiProperty({ type: UserDto })
  readonly signer: UserDto;

  @ApiProperty({ enum: SignatureStatus })
  readonly completedStatus: SignatureStatus;

  constructor(documentSignature: DocumentSignatureEntity) {
    super(documentSignature);
    this.document = documentSignature.document.toDto();
    this.signer = documentSignature.signer;
    this.completedStatus = documentSignature.completedStatus;
  }
}
