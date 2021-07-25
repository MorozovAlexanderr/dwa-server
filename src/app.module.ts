import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configModule } from './configure.root';
import { UsersModule } from './modules/users/users.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { PositionsModule } from './modules/positions/positions.module';
import { AuthModule } from './modules/auth/auth.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { StructuresModule } from './modules/structures/structures.module';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';

// NOTE: Positions and Structures modules are temporarily disabled

@Module({
  imports: [
    configModule,
    TypeOrmModule.forRoot(),
    UsersModule,
    OrganizationsModule,
    // PositionsModule,
    // StructuresModule,
    AuthModule,
    DocumentsModule,
    WorkspacesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
