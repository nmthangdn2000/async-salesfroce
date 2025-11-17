import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1763356345273 implements MigrationInterface {
    name = 'Migration1763356345273'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "source_setting" ADD "access_token" text`);
        await queryRunner.query(`ALTER TABLE "source_setting" ADD "expires_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "source_setting" DROP COLUMN "expires_at"`);
        await queryRunner.query(`ALTER TABLE "source_setting" DROP COLUMN "access_token"`);
    }

}
