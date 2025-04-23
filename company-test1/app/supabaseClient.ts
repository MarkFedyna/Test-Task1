import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bdqjvqszgzptvflkanwa.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkcWp2cXN6Z3pwdHZmbGthbndhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNjczODYsImV4cCI6MjA2MDY0MzM4Nn0.3pa3RTRkk-fUb-TcHqksdd71tkQuB9YxMSm_VrS42Lo';

export const supabase = createClient(supabaseUrl, supabaseKey);
