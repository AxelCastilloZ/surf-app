import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1782317439792 implements MigrationInterface {
    name = 'InitialSchema1782317439792'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // ── Tables ──────────────────────────────────────────────
        await queryRunner.query(`CREATE TABLE "dashboard_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" text NOT NULL, "password_hash" text NOT NULL, "role" text NOT NULL DEFAULT 'admin', "full_name" text NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_b4a03b68226a75355db8a2a4037" UNIQUE ("email"), CONSTRAINT "PK_a34bdf209c625b674f61a9a60dc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "clients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "full_name" text NOT NULL, "email" text NOT NULL, "phone" text, "country" text, "language" text NOT NULL DEFAULT 'es', "notes" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "packages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "name_en" text NOT NULL, "description" text NOT NULL DEFAULT '', "description_en" text NOT NULL DEFAULT '', "price" numeric(10,2) NOT NULL, "currency" text NOT NULL DEFAULT 'USD', "image_url" text, "is_active" boolean NOT NULL DEFAULT true, "sort_order" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_020801f620e21f943ead9311c98" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "instructors" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "full_name" text NOT NULL, "email" text NOT NULL, "google_calendar_id" text, "dashboard_user_id" uuid, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_95e3da69ca76176ea4ab8435098" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "availability" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "service_type" text NOT NULL, "available_date" date NOT NULL, "start_time" TIME NOT NULL, "end_time" TIME NOT NULL, "max_participants" integer NOT NULL DEFAULT '6', "booked_count" integer NOT NULL DEFAULT '0', "is_blocked" boolean NOT NULL DEFAULT false, "notes" text, "instructor_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "availability_unique_slot" UNIQUE ("service_type", "available_date", "start_time"), CONSTRAINT "PK_05a8158cf1112294b1c86e7f1d3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bookings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "client_id" uuid NOT NULL, "package_id" uuid, "instructor_id" uuid, "service_type" text NOT NULL, "booking_date" date NOT NULL, "start_time" TIME NOT NULL, "end_time" TIME, "participants" integer NOT NULL DEFAULT '1', "status" text NOT NULL DEFAULT 'pending', "total_price" numeric(10,2) NOT NULL, "currency" text NOT NULL DEFAULT 'USD', "notes" text, "internal_notes" text, "cancelled_reason" text, "confirmation_token" text, "confirmed_at" TIMESTAMP WITH TIME ZONE, "token_expires_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_4c6eec6e3cfcdfcf5a577575317" UNIQUE ("confirmation_token"), CONSTRAINT "PK_bee6805982cc1e248e94ce94957" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "gallery_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" text NOT NULL, "storage_path" text, "media_type" text NOT NULL DEFAULT 'image', "category" text NOT NULL DEFAULT 'general', "alt_text" text, "alt_text_en" text, "is_visible" boolean NOT NULL DEFAULT true, "sort_order" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_ca2915427d004dec2ff17f45a49" PRIMARY KEY ("id"))`);

        // ── Foreign keys ────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_23096dca2f7a9d1505d0267d4c6" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_402873fd6596d556781ac5d8ae4" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_9ad891021c6c9f7ff84ddfaf1f4" FOREIGN KEY ("instructor_id") REFERENCES "instructors"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "instructors" ADD CONSTRAINT "FK_81183e4164d4c74abc514d9449a" FOREIGN KEY ("dashboard_user_id") REFERENCES "dashboard_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "availability" ADD CONSTRAINT "FK_64573343efa329d3a79f6cb7163" FOREIGN KEY ("instructor_id") REFERENCES "instructors"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);

        // ── Indexes ─────────────────────────────────────────────
        await queryRunner.query(`CREATE INDEX "idx_dashboard_users_email" ON "dashboard_users" ("email")`);
        await queryRunner.query(`CREATE INDEX "idx_packages_is_active" ON "packages" ("is_active")`);
        await queryRunner.query(`CREATE INDEX "idx_packages_sort_order" ON "packages" ("sort_order" ASC)`);
        await queryRunner.query(`CREATE INDEX "idx_gallery_items_is_visible" ON "gallery_items" ("is_visible")`);
        await queryRunner.query(`CREATE INDEX "idx_gallery_items_category" ON "gallery_items" ("category")`);
        await queryRunner.query(`CREATE INDEX "idx_gallery_items_sort_order" ON "gallery_items" ("sort_order" ASC)`);
        await queryRunner.query(`CREATE INDEX "idx_gallery_items_storage_path" ON "gallery_items" ("storage_path") WHERE storage_path IS NOT NULL`);
        await queryRunner.query(`CREATE INDEX "idx_clients_email" ON "clients" ("email")`);
        await queryRunner.query(`CREATE INDEX "idx_clients_created_at" ON "clients" ("created_at" DESC)`);
        await queryRunner.query(`CREATE INDEX "idx_bookings_client_id" ON "bookings" ("client_id")`);
        await queryRunner.query(`CREATE INDEX "idx_bookings_package_id" ON "bookings" ("package_id")`);
        await queryRunner.query(`CREATE INDEX "idx_bookings_booking_date" ON "bookings" ("booking_date" DESC)`);
        await queryRunner.query(`CREATE INDEX "idx_bookings_status" ON "bookings" ("status")`);
        await queryRunner.query(`CREATE INDEX "idx_bookings_date_status" ON "bookings" ("booking_date" DESC, "status")`);
        await queryRunner.query(`CREATE INDEX "idx_availability_date" ON "availability" ("available_date" DESC)`);
        await queryRunner.query(`CREATE INDEX "idx_availability_service_date" ON "availability" ("service_type", "available_date")`);
        await queryRunner.query(`CREATE INDEX "idx_availability_open_slots" ON "availability" ("available_date", "service_type") WHERE is_blocked = false`);

        // ── CHECK constraints ───────────────────────────────────
        await queryRunner.query(`ALTER TABLE "dashboard_users" ADD CONSTRAINT "chk_dashboard_users_role" CHECK (role IN ('superadmin', 'admin'))`);
        await queryRunner.query(`ALTER TABLE "packages" ADD CONSTRAINT "chk_packages_price" CHECK (price >= 0)`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "chk_clients_language" CHECK (language IN ('es', 'en'))`);
        await queryRunner.query(`ALTER TABLE "gallery_items" ADD CONSTRAINT "chk_gallery_media_type" CHECK (media_type IN ('image', 'video'))`);
        await queryRunner.query(`ALTER TABLE "gallery_items" ADD CONSTRAINT "chk_gallery_category" CHECK (category IN ('lessons', 'trips', 'video_analysis', 'general'))`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "chk_bookings_service_type" CHECK (service_type IN ('surf_lesson', 'video_analysis', 'surf_trip'))`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "chk_bookings_participants" CHECK (participants >= 1)`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "chk_bookings_status" CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed'))`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "chk_bookings_total_price" CHECK (total_price >= 0)`);
        await queryRunner.query(`ALTER TABLE "availability" ADD CONSTRAINT "chk_availability_service_type" CHECK (service_type IN ('surf_lesson', 'video_analysis', 'surf_trip'))`);
        await queryRunner.query(`ALTER TABLE "availability" ADD CONSTRAINT "chk_availability_max_participants" CHECK (max_participants >= 1)`);
        await queryRunner.query(`ALTER TABLE "availability" ADD CONSTRAINT "chk_availability_booked_count" CHECK (booked_count >= 0)`);

        // ── Row Level Security ──────────────────────────────────
        // dashboard_users: solo service role
        await queryRunner.query(`ALTER TABLE "dashboard_users" ENABLE ROW LEVEL SECURITY`);
        await queryRunner.query(`CREATE POLICY "dashboard_users: solo service role" ON "dashboard_users" FOR ALL TO service_role USING (true) WITH CHECK (true)`);

        // packages: lectura pública de activos + service role full
        await queryRunner.query(`ALTER TABLE "packages" ENABLE ROW LEVEL SECURITY`);
        await queryRunner.query(`CREATE POLICY "packages: lectura pública de activos" ON "packages" FOR SELECT TO anon, authenticated USING (is_active = true)`);
        await queryRunner.query(`CREATE POLICY "packages: acceso total service role" ON "packages" FOR ALL TO service_role USING (true) WITH CHECK (true)`);

        // gallery_items: lectura pública de visibles + service role full
        await queryRunner.query(`ALTER TABLE "gallery_items" ENABLE ROW LEVEL SECURITY`);
        await queryRunner.query(`CREATE POLICY "gallery_items: lectura pública de visibles" ON "gallery_items" FOR SELECT TO anon, authenticated USING (is_visible = true)`);
        await queryRunner.query(`CREATE POLICY "gallery_items: acceso total service role" ON "gallery_items" FOR ALL TO service_role USING (true) WITH CHECK (true)`);

        // clients: solo service role
        await queryRunner.query(`ALTER TABLE "clients" ENABLE ROW LEVEL SECURITY`);
        await queryRunner.query(`CREATE POLICY "clients: solo service role" ON "clients" FOR ALL TO service_role USING (true) WITH CHECK (true)`);

        // bookings: solo service role
        await queryRunner.query(`ALTER TABLE "bookings" ENABLE ROW LEVEL SECURITY`);
        await queryRunner.query(`CREATE POLICY "bookings: solo service role" ON "bookings" FOR ALL TO service_role USING (true) WITH CHECK (true)`);

        // availability: lectura pública de no bloqueados + service role full
        await queryRunner.query(`ALTER TABLE "availability" ENABLE ROW LEVEL SECURITY`);
        await queryRunner.query(`CREATE POLICY "availability: lectura pública" ON "availability" FOR SELECT TO anon, authenticated USING (is_blocked = false)`);
        await queryRunner.query(`CREATE POLICY "availability: acceso total service role" ON "availability" FOR ALL TO service_role USING (true) WITH CHECK (true)`);

        // instructors: lectura pública de activos (para mostrar en sitio público) + service role full
        await queryRunner.query(`ALTER TABLE "instructors" ENABLE ROW LEVEL SECURITY`);
        await queryRunner.query(`CREATE POLICY "instructors: lectura pública de activos" ON "instructors" FOR SELECT TO anon, authenticated USING (is_active = true)`);
        await queryRunner.query(`CREATE POLICY "instructors: acceso total service role" ON "instructors" FOR ALL TO service_role USING (true) WITH CHECK (true)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // ── RLS policies ────────────────────────────────────────
        await queryRunner.query(`DROP POLICY IF EXISTS "instructors: acceso total service role" ON "instructors"`);
        await queryRunner.query(`DROP POLICY IF EXISTS "instructors: lectura pública de activos" ON "instructors"`);
        await queryRunner.query(`DROP POLICY IF EXISTS "availability: acceso total service role" ON "availability"`);
        await queryRunner.query(`DROP POLICY IF EXISTS "availability: lectura pública" ON "availability"`);
        await queryRunner.query(`DROP POLICY IF EXISTS "bookings: solo service role" ON "bookings"`);
        await queryRunner.query(`DROP POLICY IF EXISTS "clients: solo service role" ON "clients"`);
        await queryRunner.query(`DROP POLICY IF EXISTS "gallery_items: acceso total service role" ON "gallery_items"`);
        await queryRunner.query(`DROP POLICY IF EXISTS "gallery_items: lectura pública de visibles" ON "gallery_items"`);
        await queryRunner.query(`DROP POLICY IF EXISTS "packages: acceso total service role" ON "packages"`);
        await queryRunner.query(`DROP POLICY IF EXISTS "packages: lectura pública de activos" ON "packages"`);
        await queryRunner.query(`DROP POLICY IF EXISTS "dashboard_users: solo service role" ON "dashboard_users"`);

        // ── CHECK constraints ───────────────────────────────────
        await queryRunner.query(`ALTER TABLE "availability" DROP CONSTRAINT "chk_availability_booked_count"`);
        await queryRunner.query(`ALTER TABLE "availability" DROP CONSTRAINT "chk_availability_max_participants"`);
        await queryRunner.query(`ALTER TABLE "availability" DROP CONSTRAINT "chk_availability_service_type"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "chk_bookings_total_price"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "chk_bookings_status"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "chk_bookings_participants"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "chk_bookings_service_type"`);
        await queryRunner.query(`ALTER TABLE "gallery_items" DROP CONSTRAINT "chk_gallery_category"`);
        await queryRunner.query(`ALTER TABLE "gallery_items" DROP CONSTRAINT "chk_gallery_media_type"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "chk_clients_language"`);
        await queryRunner.query(`ALTER TABLE "packages" DROP CONSTRAINT "chk_packages_price"`);
        await queryRunner.query(`ALTER TABLE "dashboard_users" DROP CONSTRAINT "chk_dashboard_users_role"`);

        // ── Foreign keys ────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE "availability" DROP CONSTRAINT "FK_64573343efa329d3a79f6cb7163"`);
        await queryRunner.query(`ALTER TABLE "instructors" DROP CONSTRAINT "FK_81183e4164d4c74abc514d9449a"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_9ad891021c6c9f7ff84ddfaf1f4"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_402873fd6596d556781ac5d8ae4"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_23096dca2f7a9d1505d0267d4c6"`);

        // ── Tables ──────────────────────────────────────────────
        await queryRunner.query(`DROP TABLE "gallery_items"`);
        await queryRunner.query(`DROP TABLE "availability"`);
        await queryRunner.query(`DROP TABLE "instructors"`);
        await queryRunner.query(`DROP TABLE "bookings"`);
        await queryRunner.query(`DROP TABLE "packages"`);
        await queryRunner.query(`DROP TABLE "clients"`);
        await queryRunner.query(`DROP TABLE "dashboard_users"`);
    }
}
