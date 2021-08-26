import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
} from 'typeorm';
import { DocumentSignatureEntity } from '../entities/document-signature.entity';
import { DocumentsSignaturesService } from '../services/documents-signatures.service';
import { InjectConnection } from '@nestjs/typeorm';
import { DocumentsService } from '../services/documents.service';

@EventSubscriber()
export class DocumentSignatureSubscriber
  implements EntitySubscriberInterface<DocumentSignatureEntity> {
  constructor(
    @InjectConnection() connection: Connection,
    private readonly _documentsSignaturesService: DocumentsSignaturesService,
    private readonly _documentsService: DocumentsService,
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return DocumentSignatureEntity;
  }

  async afterUpdate(
    event: UpdateEvent<DocumentSignatureEntity>,
  ): Promise<void> {
    const currentSignature = event.entity as DocumentSignatureEntity;
    const { document } = event.entity;

    const areAllCompleted = await this._documentsSignaturesService.areAllSignaturesCompleted(
      currentSignature,
      document,
    );

    if (areAllCompleted) {
      await this._documentsService.setDocFinishedStatus(document);
    }
  }
}
