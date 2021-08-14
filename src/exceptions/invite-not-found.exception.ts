import { NotFoundException } from '@nestjs/common';

export class InviteNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('error.invite_not_found', error);
  }
}
