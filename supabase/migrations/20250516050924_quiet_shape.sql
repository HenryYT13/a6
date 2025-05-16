/*
  # Make submitter name optional in submissions table

  1. Changes
    - Alter submissions table to make submitter_name nullable
*/

-- Make submitter_name column nullable
ALTER TABLE submissions ALTER COLUMN submitter_name DROP NOT NULL;