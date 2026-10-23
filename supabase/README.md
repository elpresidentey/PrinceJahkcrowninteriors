# Supabase Setup Guide for POPDecor

This guide will walk you through setting up Supabase for the POPDecor platform.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Basic understanding of SQL and databases

## Step 1: Create a New Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in the details:
   - **Project Name**: popdecor (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users (e.g., Africa/Middle East)
4. Click "Create New Project"
5. Wait for the project to be provisioned (takes about 2 minutes)

## Step 2: Run the Database Schema

1. In your Supabase Dashboard, go to the **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy the entire contents of `schema.sql` file
4. Paste it into the SQL Editor
5. Click **Run** (or press Ctrl/Cmd + Enter)
6. You should see "Success. No rows returned" - this is correct!

## Step 3: Verify Tables Were Created

1. Go to **Table Editor** in the left sidebar
2. You should see the following tables:
   - `projects`
   - `project_images`
   - `services`
   - `enquiries`
   - `consultations`
   - `testimonials`

## Step 4: Set Up Storage Buckets

The SQL script should have created the storage buckets automatically. Verify by:

1. Go to **Storage** in the left sidebar
2. You should see these buckets:
   - `projects` (public)
   - `services` (public)
   - `testimonials` (public)
   - `enquiries` (private)

If they don't exist, create them manually:
1. Click **New Bucket**
2. Enter the bucket name
3. Set "Public bucket" for projects, services, and testimonials
4. Leave enquiries as private

## Step 5: Configure Authentication

1. Go to **Authentication** → **Providers** in the left sidebar
2. Enable **Email** provider (already enabled by default)
3. (Optional) Configure email templates under **Authentication** → **Email Templates**
4. (Optional) Enable other providers like Google, GitHub if needed

### Create Admin User

1. Go to **Authentication** → **Users**
2. Click **Add User** → **Create new user**
3. Enter:
   - **Email**: your admin email
   - **Password**: create a strong password
   - **Auto Confirm User**: Enable this
4. Click **Create User**
5. Save these credentials - you'll use them to log into the admin dashboard

## Step 6: Get Your API Keys

1. Go to **Project Settings** (gear icon) → **API**
2. You'll need these values:
   - **Project URL** - Copy this
   - **anon/public key** - Copy this
   - **service_role key** - Copy this (keep it secret!)

## Step 7: Configure Environment Variables

1. In your project root, create a file named `.env.local`
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

3. Replace the placeholder values with your actual keys from Step 6
4. **Never commit `.env.local` to Git!** (it's already in .gitignore)

## Step 8: Test the Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000
3. Check the browser console for any Supabase connection errors
4. If everything is set up correctly, you shouldn't see any errors

## Step 9: Upload Sample Images (Optional)

To populate your database with sample data:

1. Go to **Storage** → **projects** bucket
2. Create folders for organizing images:
   - `covers/` - for project cover images
   - `galleries/` - for project gallery images
   - `before-after/` - for before/after images

3. Upload some sample images (use placeholder images from unsplash.com if needed)

4. Update the sample data in the database to point to your uploaded images

## Step 10: Row Level Security (RLS)

The schema already includes RLS policies. Verify they're active:

1. Go to **Authentication** → **Policies**
2. You should see policies for each table
3. These policies ensure:
   - Anyone can view published content
   - Only authenticated users can manage content
   - Anyone can submit enquiries and consultation requests

## Database Structure Overview

### Projects Table
Stores all completed projects with:
- Title, description, location
- Category (pop-ceilings, living-rooms, etc.)
- Cover image and services provided
- Featured flag for highlighting projects

### Project Images Table
Stores multiple images per project:
- Gallery images
- Before images
- After images

### Services Table
Stores all services offered:
- Name, description, image
- Active/inactive status

### Enquiries Table
Stores quote requests from customers:
- Contact information
- Project details
- Status tracking (new → contacted → quoted → won/lost)

### Consultations Table
Stores site inspection requests:
- Contact information
- Preferred date/time
- Status tracking

### Testimonials Table
Stores customer reviews:
- Name, location, content
- Rating (1-5 stars)
- Published flag

## Troubleshooting

### "Missing Supabase environment variables"
- Check that `.env.local` exists and has correct values
- Restart your dev server after changing environment variables

### "Row Level Security" errors
- Make sure you're logged in as an admin user for protected operations
- Check that RLS policies are properly set up

### Storage upload fails
- Verify the bucket exists and is public (for public images)
- Check storage policies are correctly configured
- Ensure file size is within limits (default: 50MB)

### Can't see sample data
- Make sure you ran the entire schema.sql file
- Check the SQL Editor for any error messages
- Verify the data exists in Table Editor

## Next Steps

1. ✅ Database schema created
2. ✅ Storage buckets configured
3. ✅ RLS policies set up
4. ✅ Environment variables configured
5. ⏳ Build admin authentication
6. ⏳ Create admin dashboard
7. ⏳ Build public-facing pages

## Useful Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)

## Support

If you encounter issues:
1. Check the Supabase Dashboard logs
2. Review the browser console for errors
3. Verify all environment variables are correct
4. Check that your Supabase project is active (not paused)
