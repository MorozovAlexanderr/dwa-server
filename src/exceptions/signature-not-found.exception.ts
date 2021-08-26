import { NotFoundException } from '@nestjs/common';

export class SignatureNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('error.signature_not_found', error);
  }
}
