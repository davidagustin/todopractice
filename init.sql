-- Initialize the database for the Todo application
-- This script will be run when the PostgreSQL container starts

-- Create the database (if not exists)
-- Note: The database is already created by POSTGRES_DB env var

-- Connect to the todoapp database
\c todoapp;

-- The tables will be created automatically by GORM migration
-- This file is here for any additional setup if needed

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE todoapp TO todouser; 