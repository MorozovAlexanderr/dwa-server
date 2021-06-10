import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserRole } from '../common/enums/roles.enum';
import { RolesGuard } from '../modules/auth/guards/roles.guard';
import JwtAuthGuard from '../modules/auth/guards/jwt.-auth.guard';
import { Roles } from './roles.decorator';

export function Auth(...roles: UserRole[]) {
  return applyDecorators(UseGuards(JwtAuthGuard, RolesGuard), Roles(...roles));
}
