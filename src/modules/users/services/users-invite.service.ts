import { InjectRepository } from '@nestjs/typeorm';
import { UserInviteEntity } from '../entities/user-invite.entity';
import { FindConditions, Repository } from 'typeorm';
import { OrganizationEntity } from '../../organizations/entities/organization.entity';
import { UsersService } from './users.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersWorkspaceService } from './users-workspace.service';
import { ConfigService } from '@nestjs/config';
import { UserAlreadyInWorkspaceException } from '../../../exceptions/user-already-in-workspace.exception';
import { InviteNotFoundException } from '../../../exceptions/invite-not-found.exception';

export class UsersInviteService {
  constructor(
    @InjectRepository(UserInviteEntity)
    private readonly _usersInviteRepository: Repository<UserInviteEntity>,
    private readonly _usersService: UsersService,
    private readonly _usersWorkspaceService: UsersWorkspaceService,
    private readonly _configService: ConfigService,
    private readonly _mailerService: MailerService,
  ) {}

  public async getInvite(
    findData: FindConditions<UserInviteEntity>,
  ): Promise<UserInviteEntity | undefined> {
    const invite = await this._usersInviteRepository.findOne({
      relations: ['user', 'organization'],
      where: findData,
    });
    if (!invite) {
      throw new InviteNotFoundException();
    }
    return invite;
  }

  public async createInvite(
    organization: OrganizationEntity,
    email: string,
  ): Promise<UserInviteEntity> {
    const userToInvite = await this._usersService.getUser({ email });

    if (userToInvite.userWorkspace !== null) {
      throw new UserAlreadyInWorkspaceException();
    }

    const userInvite = await this._usersInviteRepository.create({
      user: userToInvite,
      organization,
    });

    await this._usersInviteRepository.save(userInvite);

    return userInvite;
  }

  public async sendInvite(userInvite: UserInviteEntity): Promise<void> {
    const confirmLink = `${this._configService.get(
      'API_URL',
    )}/users/confirm-invite/${userInvite.uuid}`;

    await this._mailerService.sendMail({
      from: this._configService.get('SMTP_USER'),
      to: userInvite.user.email,
      subject: `Invite to ${userInvite.organization.name}`,
      text: '',
      html: `
                    <div>
                        <h2>To confirm invite follow this link</h2>
                        <a href="${confirmLink}">${confirmLink}</a>
                    </div>
                `,
    });
  }

  public async confirmInvite(uuid: string): Promise<void> {
    const invite = await this.getInvite({ uuid });

    await this._usersWorkspaceService.createWorkspace(invite.user, {
      organization: invite.organization,
    });

    await this.deleteInvite(invite);
  }

  async deleteInvite(invite: UserInviteEntity): Promise<void> {
    await this._usersInviteRepository.remove(invite);
  }
}
