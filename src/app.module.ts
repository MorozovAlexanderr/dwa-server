import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configModule } from './configure.root';
import { UsersModule } from './modules/users/users.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { PositionsModule } from './modules/positions/positions.module';
import { AuthModule } from './modules/auth/auth.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { StructuresModule } from './modules/structures/structures.module';

@Module({
  imports: [
    configModule,
    TypeOrmModule.forRoot(),
    UsersModule,
    OrganizationsModule,
    PositionsModule,
    AuthModule,
    DocumentsModule,
    StructuresModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
