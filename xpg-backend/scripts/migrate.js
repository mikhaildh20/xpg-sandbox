require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function migrate() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log('Supabase credentials not set — skipping migration');
    console.log('Run the SQL manually from migrations/001_orders_transactions.sql');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const sqlPath = path.join(__dirname, '..', 'migrations', '001_orders_transactions.sql');
  const sql = fs.readFileSync(sqlPath, 'utf-8');

  const { error } = await supabase.rpc('exec_sql', { sql_query: sql });

  if (error) {
    console.error('Migration error:', error.message);
    console.log('You may need to run the SQL manually via Supabase dashboard.');
  } else {
    console.log('Migration applied successfully!');
  }
}

migrate();
