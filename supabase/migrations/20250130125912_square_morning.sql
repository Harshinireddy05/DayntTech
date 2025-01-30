/*
  # Create People Table

  1. New Tables
    - `people`
      - `id` (uuid, primary key)
      - `name` (text)
      - `dob` (date)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on `people` table
    - Add policy for authenticated users to perform all operations
*/

CREATE TABLE IF NOT EXISTS people (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  dob date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE people ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to perform all operations
CREATE POLICY "Allow authenticated users full access"
  ON people
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);