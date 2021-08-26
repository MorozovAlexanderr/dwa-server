import { Module } from '@nestjs/common';
import { DocumentsService } from './services/documents.service';
import { DocumentsController } from './documents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEntity } from './entities/document.entity';
import { DocumentSignatureEntity } from './entities/document-signature.entity';
import { DocumentsSignaturesService } from './services/documents-signatures.service';
import { UsersModule } from '../users/users.module';
import { DocumentSignatureSubscriber } from './subscribers/document-signature.subscriber';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentEntity, DocumentSignatureEntity]),
    UsersModule,
  ],
  controllers: [DocumentsController],
  providers: [
    DocumentsService,
    DocumentsSignaturesService,
    DocumentSignatureSubscriber,
  ],
})
export class DocumentsModule {}
