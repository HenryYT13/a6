/*
  # Remove home times and notifications tables

  1. Changes
    - Drop home_times table and related objects
    - Drop notifications table and related objects
*/

DROP TABLE IF EXISTS home_times CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;