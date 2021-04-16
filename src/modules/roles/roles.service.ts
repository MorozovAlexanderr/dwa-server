import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const newRole = this.roleRepository.create(createRoleDto);
    await this.roleRepository.save(newRole);
    return newRole;
  }

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  async findById(id: number): Promise<Role> {
    const role = this.roleRepository.findOne(id);
    if (role) {
      return role;
    }
    throw new HttpException(
      'Role with this id does not exists',
      HttpStatus.NOT_FOUND,
    );
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    await this.roleRepository.update(id, updateRoleDto);
  }

  async remove(id: number) {
    await this.roleRepository.delete(id);
  }
}
