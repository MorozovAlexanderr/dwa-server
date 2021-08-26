import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { SignatureStatus } from '../modules/documents/enums/signature-statuses.enum';
import { DocStatusInvalidQueryException } from '../exceptions/doc-status-invalid-query.exception';

@Injectable()
export class DocStatusQueryParamPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (Object.values(SignatureStatus).includes(value as SignatureStatus)) {
      return value;
    }
    throw new DocStatusInvalidQueryException();
  }
}
