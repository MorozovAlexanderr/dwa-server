import { SetMetadata } from '@nestjs/common';
import { UserWorkspaceRole } from '../common/enums/workspace-roles.enum';

export const ROLES_KEY = 'roles';
export const WorkspaceRoles = (...roles: UserWorkspaceRole[]) =>
  SetMetadata(ROLES_KEY, roles);
