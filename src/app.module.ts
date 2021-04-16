import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configModule } from './configure.root';
import { UsersModule } from './modules/users/users.module';
import { FacultysModule } from './modules/facultys/facultys.module';
import { RolesModule } from './modules/roles/roles.module';

@Module({
  imports: [
    configModule,
    TypeOrmModule.forRoot(),
    UsersModule,
    FacultysModule,
    RolesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
