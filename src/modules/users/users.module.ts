import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserWorkspaceEntity } from './entities/user-workspace.entity';
import { UsersWorkspaceService } from './services/users-workspace.service';
import { UserSubscriber } from './subscribers/user.subscriber';
import { UserInviteEntity } from './entities/user-invite.entity';
import { UsersInviteService } from './services/users-invite.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserWorkspaceEntity,
      UserInviteEntity,
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersWorkspaceService,
    UsersInviteService,
    UserSubscriber,
  ],
  exports: [UsersService, UsersWorkspaceService],
})
export class UsersModule {}
