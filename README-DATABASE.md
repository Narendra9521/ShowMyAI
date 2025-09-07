# Database Setup Instructions

## 1. Create Supabase Account
- Go to https://supabase.com
- Create new project

## 2. Setup Database
- In Supabase dashboard, go to SQL Editor
- Run the SQL from `setup-database.sql`

## 3. Get Credentials
- Go to Settings > API
- Copy Project URL and anon public key
- Update `.env` file with your credentials

## 4. Update Configuration
- Replace placeholders in `supabase.js` with your actual credentials
- Or use environment variables (requires build process)

## 5. Test Connection
- Open browser console
- Check for database connection errors
- Verify tools load from database