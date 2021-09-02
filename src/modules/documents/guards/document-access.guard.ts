import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { DocumentsService } from '../services/documents.service';

@Injectable()
export class DocumentAccessGuard implements CanActivate {
  constructor(private readonly _documentsService: DocumentsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { user } = request;
    const params = request.params;

    const isAccessible = await this._documentsService.isDocumentAccessibleToUser(
      user,
      params.uuid,
    );

    return isAccessible;
  }
}
