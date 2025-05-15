/*
  # Update timetable for afternoon periods

  1. Changes
    - Modify period check constraint to allow up to 9 periods (5 morning + 4 afternoon)
    - Add new periods for afternoon sessions
*/

ALTER TABLE timetable DROP CONSTRAINT IF EXISTS timetable_period_check;
ALTER TABLE timetable ADD CONSTRAINT timetable_period_check CHECK (period BETWEEN 1 AND 9);