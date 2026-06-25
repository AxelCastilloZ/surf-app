import { MigrationInterface, QueryRunner } from "typeorm";

export class BookingInstructorsM2M1782405158118 implements MigrationInterface {
    name = 'BookingInstructorsM2M1782405158118'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // ── Create join table ────────────────────────────────────
        await queryRunner.query(`
            CREATE TABLE "booking_instructors" (
                "booking_id" uuid NOT NULL,
                "instructor_id" uuid NOT NULL,
                CONSTRAINT "PK_booking_instructors" PRIMARY KEY ("booking_id", "instructor_id")
            )
        `)

        // ── Foreign keys ─────────────────────────────────────────
        await queryRunner.query(`
            ALTER TABLE "booking_instructors"
            ADD CONSTRAINT "FK_booking_instructors_booking"
            FOREIGN KEY ("booking_id") REFERENCES "bookings"("id")
            ON DELETE CASCADE ON UPDATE NO ACTION
        `)

        await queryRunner.query(`
            ALTER TABLE "booking_instructors"
            ADD CONSTRAINT "FK_booking_instructors_instructor"
            FOREIGN KEY ("instructor_id") REFERENCES "instructors"("id")
            ON DELETE CASCADE ON UPDATE NO ACTION
        `)

        // ── Indexes ──────────────────────────────────────────────
        await queryRunner.query(`CREATE INDEX "idx_booking_instructors_instructor" ON "booking_instructors" ("instructor_id")`)

        // ── Migrate existing data ────────────────────────────────
        await queryRunner.query(`
            INSERT INTO "booking_instructors" ("booking_id", "instructor_id")
            SELECT "id", "instructor_id" FROM "bookings"
            WHERE "instructor_id" IS NOT NULL
        `)

        // ── Drop old column ──────────────────────────────────────
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT IF EXISTS "FK_9ad891021c6c9f7ff84ddfaf1f4"`)
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_bookings_instructor"`)
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "instructor_id"`)

        // ── RLS ──────────────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE "booking_instructors" ENABLE ROW LEVEL SECURITY`)

        await queryRunner.query(`
            CREATE POLICY "booking_instructors: acceso total service role"
            ON "booking_instructors" FOR ALL
            TO service_role
            USING (true) WITH CHECK (true)
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // ── RLS ──────────────────────────────────────────────────
        await queryRunner.query(`DROP POLICY IF EXISTS "booking_instructors: acceso total service role" ON "booking_instructors"`)

        // ── Restore instructor_id column ─────────────────────────
        await queryRunner.query(`ALTER TABLE "bookings" ADD COLUMN "instructor_id" uuid`)
        await queryRunner.query(`
            ALTER TABLE "bookings"
            ADD CONSTRAINT "FK_9ad891021c6c9f7ff84ddfaf1f4"
            FOREIGN KEY ("instructor_id") REFERENCES "instructors"("id")
            ON DELETE SET NULL ON UPDATE NO ACTION
        `)

        // ── Migrate data back (pick first instructor per booking)
        await queryRunner.query(`
            UPDATE "bookings" b
            SET "instructor_id" = bi."instructor_id"
            FROM (
                SELECT DISTINCT ON ("booking_id") "booking_id", "instructor_id"
                FROM "booking_instructors"
                ORDER BY "booking_id"
            ) bi
            WHERE b."id" = bi."booking_id"
        `)

        // ── Drop join table ──────────────────────────────────────
        await queryRunner.query(`DROP TABLE "booking_instructors"`)
    }
}
