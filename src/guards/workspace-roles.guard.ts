import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/workspace-roles.decorator';
import { UserWorkspaceRole } from '../common/enums/workspace-roles.enum';
import { UserWorkspaceEntity } from '../modules/users/entities/user-workspace.entity';

@Injectable()
export class WorkspaceRolesGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this._reflector.getAllAndOverride<
      UserWorkspaceRole[]
    >(ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const userWorkspace = <UserWorkspaceEntity>user.userWorkspace;

    // NOTE: User may have no workspace
    return userWorkspace
      ? requiredRoles.includes(userWorkspace.accessLevel)
      : false;
  }
}
