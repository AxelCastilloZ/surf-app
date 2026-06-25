import { MigrationInterface, QueryRunner } from "typeorm";

export class DropAvailabilityTable1782404272218 implements MigrationInterface {
    name = 'DropAvailabilityTable1782404272218'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // ── RLS policies ─────────────────────────────────────────
        await queryRunner.query(`DROP POLICY IF EXISTS "availability: acceso total service role" ON "availability"`)
        await queryRunner.query(`DROP POLICY IF EXISTS "availability: lectura pública" ON "availability"`)

        // ── CHECK constraints ────────────────────────────────────
        await queryRunner.query(`ALTER TABLE "availability" DROP CONSTRAINT IF EXISTS "chk_availability_booked_count"`)
        await queryRunner.query(`ALTER TABLE "availability" DROP CONSTRAINT IF EXISTS "chk_availability_max_participants"`)
        await queryRunner.query(`ALTER TABLE "availability" DROP CONSTRAINT IF EXISTS "chk_availability_service_type"`)

        // ── Indexes ──────────────────────────────────────────────
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_availability_open_slots"`)
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_availability_service_date"`)
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_availability_date"`)

        // ── Foreign key ──────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE "availability" DROP CONSTRAINT IF EXISTS "FK_64573343efa329d3a79f6cb7163"`)

        // ── Table ────────────────────────────────────────────────
        await queryRunner.query(`DROP TABLE IF EXISTS "availability"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // ── Recreate table ───────────────────────────────────────
        await queryRunner.query(`
            CREATE TABLE "availability" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "service_type" text NOT NULL,
                "available_date" date NOT NULL,
                "start_time" TIME NOT NULL,
                "end_time" TIME NOT NULL,
                "max_participants" integer NOT NULL DEFAULT 6,
                "booked_count" integer NOT NULL DEFAULT 0,
                "is_blocked" boolean NOT NULL DEFAULT false,
                "notes" text,
                "instructor_id" uuid,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_availability" PRIMARY KEY ("id"),
                CONSTRAINT "availability_unique_slot" UNIQUE ("service_type", "available_date", "start_time")
            )
        `)

        // ── Foreign key ──────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE "availability" ADD CONSTRAINT "FK_64573343efa329d3a79f6cb7163" FOREIGN KEY ("instructor_id") REFERENCES "instructors"("id") ON DELETE SET NULL ON UPDATE NO ACTION`)

        // ── Indexes ──────────────────────────────────────────────
        await queryRunner.query(`CREATE INDEX "idx_availability_date" ON "availability" ("available_date" DESC)`)
        await queryRunner.query(`CREATE INDEX "idx_availability_service_date" ON "availability" ("service_type", "available_date")`)
        await queryRunner.query(`CREATE INDEX "idx_availability_open_slots" ON "availability" ("available_date", "service_type") WHERE is_blocked = false`)

        // ── CHECK constraints ────────────────────────────────────
        await queryRunner.query(`ALTER TABLE "availability" ADD CONSTRAINT "chk_availability_service_type" CHECK (service_type IN ('surf_lesson', 'video_analysis', 'surf_trip'))`)
        await queryRunner.query(`ALTER TABLE "availability" ADD CONSTRAINT "chk_availability_max_participants" CHECK (max_participants >= 1)`)
        await queryRunner.query(`ALTER TABLE "availability" ADD CONSTRAINT "chk_availability_booked_count" CHECK (booked_count >= 0)`)

        // ── RLS ──────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE "availability" ENABLE ROW LEVEL SECURITY`)
        await queryRunner.query(`CREATE POLICY "availability: lectura pública" ON "availability" FOR SELECT TO anon, authenticated USING (is_blocked = false)`)
        await queryRunner.query(`CREATE POLICY "availability: acceso total service role" ON "availability" FOR ALL TO service_role USING (true) WITH CHECK (true)`)
    }
}
