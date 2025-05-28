
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://paohzlivrrfabirfrcbz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhb2h6bGl2cnJmYWJpcmZyY2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNjEzMDUsImV4cCI6MjA2MzgzNzMwNX0.8_nc-KZ4Z3FQCSRlQwRaeYuBhtWis04inxas4hmQALs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
