import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { OrganizationDto } from '../dtos/organization.dto';
import { DocumentEntity } from '../../documents/entities/document.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity({ name: 'organizations' })
export class OrganizationEntity extends AbstractEntity<OrganizationDto> {
  @Column()
  name: string;

  @OneToMany(() => DocumentEntity, (document) => document.organization)
  documents: DocumentEntity[];

  @OneToMany(() => UserEntity, (user) => user.organization)
  users: UserEntity[];

  dtoClass = OrganizationDto;
}
