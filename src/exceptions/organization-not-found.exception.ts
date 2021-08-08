import { NotFoundException } from '@nestjs/common';

export class OrganizationNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('error.organization_not_found', error);
  }
}
