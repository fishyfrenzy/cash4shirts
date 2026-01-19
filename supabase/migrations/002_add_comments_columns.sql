-- Add user_comments column
ALTER TABLE leads ADD COLUMN user_comments TEXT;

-- Rename notes to admin_notes
ALTER TABLE leads RENAME COLUMN notes TO admin_notes;

-- Update comments for documentation
COMMENT ON COLUMN leads.user_comments IS 'Additional details provided by the user during the quiz';
COMMENT ON COLUMN leads.admin_notes IS 'Internal notes added by admins for lead management';
