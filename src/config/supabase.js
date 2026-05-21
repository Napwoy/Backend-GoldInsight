const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Validasi sederhana untuk memastikan environment variables terisi
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('YOUR_') || supabaseAnonKey.includes('YOUR_')) {
  console.warn('⚠️ WARNING: Supabase URL atau Anon Key belum dikonfigurasi di file .env!');
}

const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder');

module.exports = supabase;
