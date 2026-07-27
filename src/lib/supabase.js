import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mowhkxvmntoomljvrosb.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_6wfexY1R73KxIfPx8wqKXw_MjzFDBba'

export const supabase = createClient(supabaseUrl, supabaseKey)
