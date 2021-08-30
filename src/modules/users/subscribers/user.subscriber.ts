import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UtilsService } from '../../../utils/utils.service';
import { AvatarColor } from '../enums/avatar-colors.enum';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return UserEntity;
  }

  beforeInsert(event: InsertEvent<UserEntity>): void {
    event.entity.password = UtilsService.generateHash(event.entity.password);
    event.entity.avatarColor = UtilsService.getRandomEnumValue(
      AvatarColor,
    ) as AvatarColor;
  }
}
