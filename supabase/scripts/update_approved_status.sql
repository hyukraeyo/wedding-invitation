-- Update existing approved invitations in approval_requests table
-- This script updates approval_requests status to 'approved' for invitations that have isApproved=true

UPDATE public.approval_requests
SET 
    status = 'approved',
    reviewed_at = NOW()
WHERE invitation_id IN (
    SELECT id 
    FROM public.invitations 
    WHERE invitation_data->>'isApproved' = 'true'
)
AND status = 'pending';
