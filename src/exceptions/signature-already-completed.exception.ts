import { BadRequestException } from '@nestjs/common';

export class SignatureAlreadyCompletedException extends BadRequestException {
  constructor(error?: string) {
    super('error.signature_already_completed', error);
  }
}
