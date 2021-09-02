import { BadRequestException } from '@nestjs/common';

export class DocumentDeletionFailedException extends BadRequestException {
  constructor(error?: string) {
    super('error.document_deletion_exception', error);
  }
}
