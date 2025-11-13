import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOauthFieldsToSourceSetting1763012000000
  implements MigrationInterface
{
  name = 'AddOauthFieldsToSourceSetting1763012000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Make secrets_ref nullable (optional)
    await queryRunner.query(`
      ALTER TABLE "source_setting"
      ALTER COLUMN "secrets_ref" DROP NOT NULL
    `);
    
    // Add OAuth 2.0 fields
    await queryRunner.query(`
      ALTER TABLE "source_setting"
      ADD COLUMN "client_id" character varying(255),
      ADD COLUMN "client_secret" character varying(500),
      ADD COLUMN "refresh_token" text
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove OAuth 2.0 fields
    await queryRunner.query(`
      ALTER TABLE "source_setting"
      DROP COLUMN "refresh_token",
      DROP COLUMN "client_secret",
      DROP COLUMN "client_id"
    `);
    
    // Revert secrets_ref to NOT NULL (if needed)
    // Note: This might fail if there are NULL values, so we'll make it nullable first
    await queryRunner.query(`
      ALTER TABLE "source_setting"
      ALTER COLUMN "secrets_ref" SET NOT NULL
    `);
  }
}

