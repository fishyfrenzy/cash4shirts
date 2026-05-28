-- Phase 1: the lead notification path moved into the Next.js /api/leads route
-- (CLAUDE.md §7). Drop the old DB trigger + edge-function bridge so Jake does
-- not receive duplicate SMS for each new lead.

DROP TRIGGER IF EXISTS on_new_lead_created ON leads;
DROP FUNCTION IF EXISTS notify_new_lead();
