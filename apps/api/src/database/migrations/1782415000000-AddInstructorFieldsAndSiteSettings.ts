import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddInstructorFieldsAndSiteSettings1782415000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "instructors" ADD COLUMN "photo_url" text`)
    await queryRunner.query(`ALTER TABLE "instructors" ADD COLUMN "storage_path" text`)
    await queryRunner.query(`ALTER TABLE "instructors" ADD COLUMN "bio" text`)

    await queryRunner.query(`
      CREATE TABLE "site_settings" (
        "key"        text NOT NULL,
        "value"      text NOT NULL,
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "pk_site_settings" PRIMARY KEY ("key")
      )
    `)

    await queryRunner.query(`
      INSERT INTO "site_settings" ("key", "value") VALUES
        ('hero_image_url', 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1600')
    `)

    await queryRunner.query(`ALTER TABLE "site_settings" ENABLE ROW LEVEL SECURITY`)

    await queryRunner.query(`
      CREATE POLICY "site_settings_public_read" ON "site_settings"
        FOR SELECT USING (true)
    `)

    await queryRunner.query(`
      CREATE POLICY "site_settings_service_insert" ON "site_settings"
        FOR INSERT TO service_role WITH CHECK (true)
    `)

    await queryRunner.query(`
      CREATE POLICY "site_settings_service_update" ON "site_settings"
        FOR UPDATE TO service_role USING (true) WITH CHECK (true)
    `)

    await queryRunner.query(`
      CREATE POLICY "site_settings_service_delete" ON "site_settings"
        FOR DELETE TO service_role USING (true)
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP POLICY IF EXISTS "site_settings_service_delete" ON "site_settings"`)
    await queryRunner.query(`DROP POLICY IF EXISTS "site_settings_service_update" ON "site_settings"`)
    await queryRunner.query(`DROP POLICY IF EXISTS "site_settings_service_insert" ON "site_settings"`)
    await queryRunner.query(`DROP POLICY IF EXISTS "site_settings_public_read" ON "site_settings"`)
    await queryRunner.query(`DROP TABLE "site_settings"`)

    await queryRunner.query(`ALTER TABLE "instructors" DROP COLUMN "bio"`)
    await queryRunner.query(`ALTER TABLE "instructors" DROP COLUMN "storage_path"`)
    await queryRunner.query(`ALTER TABLE "instructors" DROP COLUMN "photo_url"`)
  }
}
