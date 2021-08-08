import { NotFoundException } from '@nestjs/common';

export class WorkspaceNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('error.workspace_not_found', error);
  }
}
