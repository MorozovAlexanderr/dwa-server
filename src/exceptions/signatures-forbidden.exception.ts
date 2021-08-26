import { ForbiddenException } from '@nestjs/common';

export class SignaturesForbiddenException extends ForbiddenException {
  constructor(error?: string) {
    super('error.signatures_forbidden', error);
  }
}
