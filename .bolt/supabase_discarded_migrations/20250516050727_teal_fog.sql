/*
  # Remove submitter_name from submissions table

  1. Changes
    - Remove submitter_name column from submissions table
    - Update existing data to handle the removal
*/

ALTER TABLE submissions DROP COLUMN submitter_name;