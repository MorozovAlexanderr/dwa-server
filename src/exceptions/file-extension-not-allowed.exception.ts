import { BadRequestException } from '@nestjs/common';

export class FileExtensionNotAllowedException extends BadRequestException {
  constructor(error?: string) {
    super('error.file_extension_not_allowed', error);
  }
}
