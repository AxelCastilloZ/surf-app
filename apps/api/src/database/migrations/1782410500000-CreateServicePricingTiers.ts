import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateServicePricingTiers1782410500000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "service_pricing_tiers" (
        "id"               uuid DEFAULT gen_random_uuid() NOT NULL,
        "service_type"     text NOT NULL,
        "min_participants" integer NOT NULL,
        "max_participants" integer NOT NULL,
        "price_per_person" numeric(10,2) NOT NULL,
        "is_active"        boolean NOT NULL DEFAULT true,
        "created_at"       timestamptz NOT NULL DEFAULT now(),
        "updated_at"       timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "pk_service_pricing_tiers" PRIMARY KEY ("id")
      )
    `)

    await queryRunner.query(`
      ALTER TABLE "service_pricing_tiers"
        ADD CONSTRAINT "chk_spt_service_type"
        CHECK (service_type IN ('surf_lesson', 'video_analysis', 'surf_trip'))
    `)

    await queryRunner.query(`
      ALTER TABLE "service_pricing_tiers"
        ADD CONSTRAINT "chk_spt_participants"
        CHECK (min_participants >= 1 AND max_participants >= min_participants)
    `)

    await queryRunner.query(`
      ALTER TABLE "service_pricing_tiers"
        ADD CONSTRAINT "chk_spt_price"
        CHECK (price_per_person > 0)
    `)

    await queryRunner.query(`
      CREATE INDEX "idx_spt_service_type" ON "service_pricing_tiers" ("service_type")
    `)

    await queryRunner.query(`
      CREATE INDEX "idx_spt_lookup" ON "service_pricing_tiers" ("service_type", "is_active", "min_participants", "max_participants")
    `)

    await queryRunner.query(`ALTER TABLE "service_pricing_tiers" ENABLE ROW LEVEL SECURITY`)

    await queryRunner.query(`
      CREATE POLICY "spt_public_read" ON "service_pricing_tiers"
        FOR SELECT USING (is_active = true)
    `)

    await queryRunner.query(`
      CREATE POLICY "spt_service_insert" ON "service_pricing_tiers"
        FOR INSERT WITH CHECK (current_setting('role') = 'service_role')
    `)

    await queryRunner.query(`
      CREATE POLICY "spt_service_update" ON "service_pricing_tiers"
        FOR UPDATE USING (current_setting('role') = 'service_role')
    `)

    await queryRunner.query(`
      CREATE POLICY "spt_service_delete" ON "service_pricing_tiers"
        FOR DELETE USING (current_setting('role') = 'service_role')
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP POLICY IF EXISTS "spt_service_delete" ON "service_pricing_tiers"`)
    await queryRunner.query(`DROP POLICY IF EXISTS "spt_service_update" ON "service_pricing_tiers"`)
    await queryRunner.query(`DROP POLICY IF EXISTS "spt_service_insert" ON "service_pricing_tiers"`)
    await queryRunner.query(`DROP POLICY IF EXISTS "spt_public_read" ON "service_pricing_tiers"`)
    await queryRunner.query(`DROP TABLE "service_pricing_tiers"`)
  }
}
