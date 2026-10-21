-- Add English bio column to instructors table
ALTER TABLE instructors ADD COLUMN IF NOT EXISTS bio_en text;
