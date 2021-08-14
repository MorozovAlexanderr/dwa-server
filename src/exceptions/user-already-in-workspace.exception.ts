import { BadRequestException } from '@nestjs/common';

export class UserAlreadyInWorkspaceException extends BadRequestException {
  constructor(error?: string) {
    super('error.user_already_in_workspace', error);
  }
}
