import { MigrationInterface, QueryRunner } from "typeorm";

export class InstructorReviews1782368561328 implements MigrationInterface {
    name = 'InstructorReviews1782368561328'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // ── Table ────────────────────────────────────────────────
        await queryRunner.query(`
            CREATE TABLE "instructor_reviews" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "instructor_id" uuid NOT NULL,
                "booking_id" uuid NOT NULL,
                "client_name" text NOT NULL,
                "rating" integer NOT NULL,
                "comment" text,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_instructor_reviews" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_instructor_reviews_booking" UNIQUE ("booking_id")
            )
        `);

        // ── Foreign keys ─────────────────────────────────────────
        await queryRunner.query(`
            ALTER TABLE "instructor_reviews"
            ADD CONSTRAINT "FK_instructor_reviews_instructor"
            FOREIGN KEY ("instructor_id") REFERENCES "instructors"("id")
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "instructor_reviews"
            ADD CONSTRAINT "FK_instructor_reviews_booking"
            FOREIGN KEY ("booking_id") REFERENCES "bookings"("id")
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        // ── Indexes ──────────────────────────────────────────────
        await queryRunner.query(`CREATE INDEX "idx_instructor_reviews_instructor" ON "instructor_reviews" ("instructor_id")`);
        await queryRunner.query(`CREATE INDEX "idx_instructor_reviews_rating" ON "instructor_reviews" ("rating")`);
        await queryRunner.query(`CREATE INDEX "idx_instructor_reviews_created_at" ON "instructor_reviews" ("created_at" DESC)`);

        // ── CHECK constraints ────────────────────────────────────
        await queryRunner.query(`ALTER TABLE "instructor_reviews" ADD CONSTRAINT "chk_instructor_reviews_rating" CHECK (rating >= 1 AND rating <= 5)`);

        // ── Row Level Security ───────────────────────────────────
        await queryRunner.query(`ALTER TABLE "instructor_reviews" ENABLE ROW LEVEL SECURITY`);

        await queryRunner.query(`
            CREATE POLICY "instructor_reviews: lectura pública"
            ON "instructor_reviews" FOR SELECT
            TO anon, authenticated
            USING (true)
        `);

        await queryRunner.query(`
            CREATE POLICY "instructor_reviews: acceso total service role"
            ON "instructor_reviews" FOR ALL
            TO service_role
            USING (true) WITH CHECK (true)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // ── RLS policies ─────────────────────────────────────────
        await queryRunner.query(`DROP POLICY IF EXISTS "instructor_reviews: acceso total service role" ON "instructor_reviews"`);
        await queryRunner.query(`DROP POLICY IF EXISTS "instructor_reviews: lectura pública" ON "instructor_reviews"`);

        // ── CHECK constraints ────────────────────────────────────
        await queryRunner.query(`ALTER TABLE "instructor_reviews" DROP CONSTRAINT "chk_instructor_reviews_rating"`);

        // ── Foreign keys ─────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE "instructor_reviews" DROP CONSTRAINT "FK_instructor_reviews_booking"`);
        await queryRunner.query(`ALTER TABLE "instructor_reviews" DROP CONSTRAINT "FK_instructor_reviews_instructor"`);

        // ── Table ────────────────────────────────────────────────
        await queryRunner.query(`DROP TABLE "instructor_reviews"`);
    }
}
