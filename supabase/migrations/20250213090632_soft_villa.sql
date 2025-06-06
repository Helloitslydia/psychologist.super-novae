/*
  # Update psychologist table constraints

  1. Changes
    - Make address field nullable
    - Make postal_code field nullable
    - Make hourly_rate field nullable
    - Make years_of_experience field nullable

  2. Reason
    - These fields are now optional in the registration form
*/

ALTER TABLE psychologists
ALTER COLUMN address DROP NOT NULL,
ALTER COLUMN postal_code DROP NOT NULL,
ALTER COLUMN hourly_rate DROP NOT NULL,
ALTER COLUMN years_of_experience DROP NOT NULL;