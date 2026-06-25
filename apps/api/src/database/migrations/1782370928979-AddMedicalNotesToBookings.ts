import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMedicalNotesToBookings1782370928979 implements MigrationInterface {
    name = 'AddMedicalNotesToBookings1782370928979'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "bookings"
            ADD COLUMN "medical_notes" text NOT NULL DEFAULT ''
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "bookings"
            DROP COLUMN "medical_notes"
        `)
    }
}
