CREATE TABLE public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('reservation','contact','event')),
  venue text,
  full_name text NOT NULL,
  email text,
  phone text,
  subject text,
  event_type text,
  preferred_date date,
  preferred_time text,
  guests integer,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.enquiries TO service_role;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;