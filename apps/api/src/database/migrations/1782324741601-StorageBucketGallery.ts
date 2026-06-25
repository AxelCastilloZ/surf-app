import { MigrationInterface, QueryRunner } from "typeorm";

export class StorageBucketGallery1782324741601 implements MigrationInterface {
    name = 'StorageBucketGallery1782324741601'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // ── Bucket ───────────────────────────────────────────────
        await queryRunner.query(`
            INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
            VALUES (
                'gallery',
                'gallery',
                true,
                52428800,
                ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']
            )
            ON CONFLICT (id) DO NOTHING
        `);

        // ── Policies ─────────────────────────────────────────────
        await queryRunner.query(`
            DO $$ BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_policies
                    WHERE schemaname = 'storage' AND tablename = 'objects'
                      AND policyname = 'gallery: lectura pública'
                ) THEN
                    CREATE POLICY "gallery: lectura pública"
                    ON storage.objects FOR SELECT
                    TO anon, authenticated
                    USING (bucket_id = 'gallery');
                END IF;
            END $$
        `);

        await queryRunner.query(`
            DO $$ BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_policies
                    WHERE schemaname = 'storage' AND tablename = 'objects'
                      AND policyname = 'gallery: upload service role'
                ) THEN
                    CREATE POLICY "gallery: upload service role"
                    ON storage.objects FOR INSERT
                    TO service_role
                    WITH CHECK (bucket_id = 'gallery');
                END IF;
            END $$
        `);

        await queryRunner.query(`
            DO $$ BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_policies
                    WHERE schemaname = 'storage' AND tablename = 'objects'
                      AND policyname = 'gallery: update service role'
                ) THEN
                    CREATE POLICY "gallery: update service role"
                    ON storage.objects FOR UPDATE
                    TO service_role
                    USING (bucket_id = 'gallery');
                END IF;
            END $$
        `);

        await queryRunner.query(`
            DO $$ BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_policies
                    WHERE schemaname = 'storage' AND tablename = 'objects'
                      AND policyname = 'gallery: delete service role'
                ) THEN
                    CREATE POLICY "gallery: delete service role"
                    ON storage.objects FOR DELETE
                    TO service_role
                    USING (bucket_id = 'gallery');
                END IF;
            END $$
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // ── Policies ─────────────────────────────────────────────
        await queryRunner.query(`DROP POLICY IF EXISTS "gallery: delete service role" ON storage.objects`);
        await queryRunner.query(`DROP POLICY IF EXISTS "gallery: update service role" ON storage.objects`);
        await queryRunner.query(`DROP POLICY IF EXISTS "gallery: upload service role" ON storage.objects`);
        await queryRunner.query(`DROP POLICY IF EXISTS "gallery: lectura pública" ON storage.objects`);

        // ── Objetos del bucket y bucket ──────────────────────────
        await queryRunner.query(`DELETE FROM storage.objects WHERE bucket_id = 'gallery'`);
        await queryRunner.query(`DELETE FROM storage.buckets WHERE id = 'gallery'`);
    }
}
