import { UserEntity } from '../../users/entities/user.entity';

export interface RequestWithUser extends Request {
  user: UserEntity;
}
