import { NotFoundException } from '@nestjs/common';

export class DocumentNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('error.document_not_found', error);
  }
}
