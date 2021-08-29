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

    const isAccess = await this._documentsService.isUserHasAccessToDocument(
      user,
      params.uuid,
    );

    return isAccess;
  }
}
