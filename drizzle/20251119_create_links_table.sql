-- name: 20251119_create_links_table
-- Create links table
CREATE TABLE IF NOT EXISTS public.links (
  id serial PRIMARY KEY,
  code varchar(8) NOT NULL,
  target text NOT NULL,
  clicks integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_clicked timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS links_code_idx ON public.links(code);
