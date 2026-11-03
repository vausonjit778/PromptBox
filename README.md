# PromptBox website source

This package recreates the public-facing PromptBox landing page structure and connects its login + saved prompt display to Supabase.

## Files
- index.html
- style.css
- app.js

## Before publishing
1. In `app.js`, replace `YOUR_SUPABASE_PROJECT_URL` and `YOUR_SUPABASE_ANON_PUBLIC_KEY` with your Supabase Project URL and anon/public key (Project Settings → API).
2. Never use the `service_role` key in browser code.
3. This code assumes `public.prompts` has columns `id` (uuid or identity), `user_id` (uuid), `title` (text), `content` (text), and optionally `created_at`.
4. Enable Supabase Auth Email provider.
5. Ensure RLS policies allow each logged-in user to select/insert only their own rows (`auth.uid() = user_id`), and update/delete only their own rows.
6. Deploy these files to Cloudflare Pages or GitHub Pages.

## Important schema note
The code expects the prompt body column to be named `content`. If your existing table uses another name (for example `prompt`), change the select and insert field names in `app.js` to match. Confirm your actual columns before production use.

## Current scope
This recreates the homepage sections, sample prompt cards, category filters, copy buttons, email signup/login, and reads a user's saved prompts. It does not yet implement a full create/edit/delete dashboard for saved prompts or course management.
