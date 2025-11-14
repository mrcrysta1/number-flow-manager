# Number Manager System

A complete number management system with authentication, automatic daily resets, and admin panel.

## Features Implemented

### ✅ User Authentication
- Secure login and signup system
- Username-based accounts
- Protected routes (only logged-in users can access dashboard)
- Session management with automatic redirects

### ✅ Number Management
- Upload numbers via text input or .txt file
- Two-list system: Available ↔ Used
- One-click copy automatically moves numbers to Used list
- Real-time updates across all users
- Search and filter capabilities

### ✅ Delete & Reset Features
- **Delete All**: Completely clear both Available and Used lists
- **Manual Reset**: Move all Used numbers back to Available
- **Automatic Daily Reset**: Runs at 5:00 AM Pakistan Time (PKT/GMT+5)

### ✅ Admin Panel
- User management interface
- Grant/revoke admin privileges
- View all users and their roles
- Delete user accounts (Note: requires backend setup for full functionality)

### ✅ UI/UX
- Clean, modern dashboard design
- Mobile-responsive layout
- Side-by-side Available/Used lists
- Toast notifications for all actions
- Smooth animations and transitions
- Professional color scheme with blue accents

## Important Setup: Daily Reset Cron Job

The daily reset at 5:00 AM Pakistan Time requires a cron job to be set up. Follow these steps:

### Option 1: Using Lovable Cloud Backend

1. Go to your backend management (click "View Backend" below)
2. Enable the `pg_cron` extension
3. Run this SQL in the SQL Editor:

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the daily reset at 5:00 AM Pakistan Time (00:00 UTC = 5:00 AM PKT)
SELECT cron.schedule(
  'daily-number-reset',
  '0 0 * * *',
  $$
  SELECT
    net.http_post(
      url := 'YOUR_PROJECT_URL/functions/v1/daily-reset',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb,
      body := concat('{"time": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);
```

Replace:
- `YOUR_PROJECT_URL` with: `https://hcyfqcrylstpskzxixtw.supabase.co`
- `YOUR_ANON_KEY` with: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjeWZxY3J5bHN0cHNrenhpeHR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMDQzODMsImV4cCI6MjA3ODY4MDM4M30.tZFgpGiqTLxmKyCZ9g7ErEGrnd5h47bgTKMfmjqKnes`

### Option 2: External Cron Service

Use a service like cron-job.org or EasyCron to call:
```
https://hcyfqcrylstpskzxixtw.supabase.co/functions/v1/daily-reset
```

Schedule: Daily at 00:00 UTC (5:00 AM PKT)

## First Steps

1. **Create Your Account**: Click "Get Started" and sign up
2. **Upload Numbers**: Use the text input or file upload
3. **Copy Numbers**: Click any number in Available list to copy and move to Used
4. **Reset When Needed**: Use Manual Reset or wait for automatic daily reset
5. **Manage Users (Admin)**: Access Admin Panel to manage user roles

## Admin Access

The first user to sign up will need admin privileges added manually via backend:

```sql
INSERT INTO user_roles (user_id, role)
VALUES ('YOUR_USER_ID', 'admin');
```

## Tech Stack

- React + TypeScript
- Tailwind CSS for styling
- Lovable Cloud (Supabase) for backend
- Real-time updates
- Secure authentication
- Edge functions for scheduled tasks

## Support

For any issues or questions about the cron job setup or other features, consult the Lovable Cloud documentation.
