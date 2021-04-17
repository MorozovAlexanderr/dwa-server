import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configModule } from './configure.root';
import { UsersModule } from './modules/users/users.module';
import { FacultiesModule } from './modules/faculties/faculties.module';
import { RolesModule } from './modules/roles/roles.module';

@Module({
  imports: [
    configModule,
    TypeOrmModule.forRoot(),
    UsersModule,
    FacultiesModule,
    RolesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
