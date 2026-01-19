-- Add rejection_reason column to approval_requests table
ALTER TABLE public.approval_requests 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Add comment
COMMENT ON COLUMN public.approval_requests.rejection_reason IS 'Reason for rejection provided by admin';
