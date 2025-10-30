import { createClient } from '@supabase/supabase-js'

// 👇 Replace with your Supabase project URL and anon key
const supabaseUrl = 'https://yzjtdkplrbsplvqruvwc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6anRka3BscmJzcGx2cXJ1dndjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3ODY1MDIsImV4cCI6MjA3MTM2MjUwMn0.X71bji29vWIrpEg8BhrlkwuzUihVl02TpSBOM2YVmYA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
