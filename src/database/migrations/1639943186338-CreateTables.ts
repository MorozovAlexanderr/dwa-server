import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1639943186338 implements MigrationInterface {
  name = 'CreateTables1639943186338';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users_invite" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "organizationId" integer, "userId" integer NOT NULL, CONSTRAINT "REL_6db9ef2e32c5aee2d715fad50a" UNIQUE ("userId"), CONSTRAINT "PK_b7f0fb0b526e92856c707c8b882" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organizations" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_6b031fcd0863e3f6b44230163f9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_workspace_accesslevel_enum" AS ENUM('member', 'admin')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users_workspace" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "accessLevel" "public"."users_workspace_accesslevel_enum" NOT NULL DEFAULT 'member', "organizationId" integer, "userId" integer, CONSTRAINT "REL_730627dbdb258a2150b1fd0cad" UNIQUE ("userId"), CONSTRAINT "PK_9ef32eab3ccaf4744fd36317c15" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_avatarcolor_enum" AS ENUM('#C3CAFF', '#FDCF99', '#F5A09D', '#98E898')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "firstName" character varying NOT NULL, "secondName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "currentHashedRefreshToken" character varying, "avatarColor" "public"."users_avatarcolor_enum" NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "documents" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "name" character varying NOT NULL, "filePath" character varying NOT NULL, "description" character varying, "isReady" boolean NOT NULL DEFAULT false, "expiresAt" TIMESTAMP NOT NULL DEFAULT now(), "creatorId" integer, "organizationId" integer, CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."documents_signatures_completedstatus_enum" AS ENUM('signed', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TABLE "documents_signatures" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "completedStatus" "public"."documents_signatures_completedstatus_enum", "isCompleted" boolean NOT NULL DEFAULT false, "documentId" integer, "signerId" integer, CONSTRAINT "PK_6ebf6a130c86c40a335871cd000" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_invite" ADD CONSTRAINT "FK_eb2b64fb858922d33fca8f5e68f" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_invite" ADD CONSTRAINT "FK_6db9ef2e32c5aee2d715fad50a8" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_workspace" ADD CONSTRAINT "FK_b1dcd74887f8912f07a77915ff5" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_workspace" ADD CONSTRAINT "FK_730627dbdb258a2150b1fd0cad0" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "FK_e5beef6eb645b82933f1e577a53" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "FK_f16eaa571c8fc0ee214cad0f1c3" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents_signatures" ADD CONSTRAINT "FK_f7adf1b656de6ed136d60f5159e" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents_signatures" ADD CONSTRAINT "FK_5c4bc190e9ca47a45ec2d7845ac" FOREIGN KEY ("signerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "documents_signatures" DROP CONSTRAINT "FK_5c4bc190e9ca47a45ec2d7845ac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents_signatures" DROP CONSTRAINT "FK_f7adf1b656de6ed136d60f5159e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "FK_f16eaa571c8fc0ee214cad0f1c3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "FK_e5beef6eb645b82933f1e577a53"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_workspace" DROP CONSTRAINT "FK_730627dbdb258a2150b1fd0cad0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_workspace" DROP CONSTRAINT "FK_b1dcd74887f8912f07a77915ff5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_invite" DROP CONSTRAINT "FK_6db9ef2e32c5aee2d715fad50a8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_invite" DROP CONSTRAINT "FK_eb2b64fb858922d33fca8f5e68f"`,
    );
    await queryRunner.query(`DROP TABLE "documents_signatures"`);
    await queryRunner.query(
      `DROP TYPE "public"."documents_signatures_completedstatus_enum"`,
    );
    await queryRunner.query(`DROP TABLE "documents"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_avatarcolor_enum"`);
    await queryRunner.query(`DROP TABLE "users_workspace"`);
    await queryRunner.query(
      `DROP TYPE "public"."users_workspace_accesslevel_enum"`,
    );
    await queryRunner.query(`DROP TABLE "organizations"`);
    await queryRunner.query(`DROP TABLE "users_invite"`);
  }
}
