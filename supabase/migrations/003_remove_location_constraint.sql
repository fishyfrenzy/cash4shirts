-- Drop the existing check constraint on the location column
ALTER TABLE leads DROP CONSTRAINT leads_location_check;

-- Add a comment to document that the column now accepts any string
COMMENT ON COLUMN leads.location IS 'Lead location - typically indianapolis, florida, or a custom string';
