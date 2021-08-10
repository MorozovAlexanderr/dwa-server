import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UtilsService } from '../../../utils/utils.service';

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
  }
}
