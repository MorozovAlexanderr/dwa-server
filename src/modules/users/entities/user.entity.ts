import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Faculty } from '../../faculties/entities/faculty.entity';
import { Role } from '../../roles/entities/role.entity';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  username: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    nullable: true,
  })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @ApiProperty()
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty()
  @ManyToOne(() => Faculty, (faculty) => faculty.user, {
    eager: true,
  })
  faculty: Faculty;

  @ApiProperty()
  @ManyToOne(() => Role, (role) => role.user, {
    eager: true,
  })
  role: Role;
}
