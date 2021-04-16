import { Module } from '@nestjs/common';
import { FacultysService } from './facultys.service';
import { FacultysController } from './facultys.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Faculty } from './entities/faculty.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Faculty])],
  controllers: [FacultysController],
  providers: [FacultysService],
})
export class FacultysModule {}
