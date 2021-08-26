import { BadRequestException } from '@nestjs/common';

export class DocStatusInvalidQueryException extends BadRequestException {
  constructor(error?: string) {
    super('error.doc_status_invalid_query', error);
  }
}
