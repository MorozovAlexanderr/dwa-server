import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { StructureDto } from '../dto/structure.dto';
import { Column, Entity, Tree, TreeChildren, TreeParent } from 'typeorm';

@Entity('structures')
@Tree('closure-table')
export class StructureEntity extends AbstractEntity<StructureDto> {
  @Column()
  name: string;

  @TreeParent({ onDelete: 'CASCADE' })
  parent: StructureEntity;

  @TreeChildren()
  children: StructureEntity[];

  dtoClass = StructureDto;
}
