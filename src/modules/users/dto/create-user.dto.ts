import { Faculty } from '../../facultys/entities/faculty.entity';
import { Role } from '../../roles/entities/role.entity';

export class CreateUserDto {
  username: string;
  email: string;
  password: string;
  faculty: Faculty;
  role: Role;
}
