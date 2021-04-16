import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Faculty } from '../../facultys/entities/faculty.entity';
import { Role } from '../../roles/entities/role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Faculty, (faculty) => faculty.user)
  faculty: Faculty;

  @ManyToOne(() => Role, (role) => role.user)
  role: Role;
}
