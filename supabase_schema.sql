-- ==========================================
-- 1. DATABASE TABLES
-- ==========================================

-- Create Artists Table
CREATE TABLE IF NOT EXISTS public.artists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    bio TEXT,
    genre TEXT,
    profile_image_url TEXT,
    socials JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create Tracks Table
CREATE TABLE IF NOT EXISTS public.tracks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    artist_id UUID REFERENCES public.artists(id) ON DELETE SET NULL,
    artist_name TEXT, 
    main_artist TEXT,
    featured_artists TEXT,
    genre TEXT,
    bpm INTEGER DEFAULT 120,
    mood TEXT,
    cover_url TEXT,
    audio_url TEXT NOT NULL,
    description TEXT,
    tags TEXT[] DEFAULT '{}',
    license_type TEXT DEFAULT 'Free',
    likes INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    credits JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    username TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'listener',
    is_verified BOOLEAN DEFAULT false,
    liked_track_ids UUID[] DEFAULT '{}',
    following_artist_ids UUID[] DEFAULT '{}',
    download_history JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on Tables
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Table Policies
CREATE POLICY "Allow public read artists" ON public.artists FOR SELECT USING (true);
CREATE POLICY "Allow public read tracks" ON public.tracks FOR SELECT USING (true);
CREATE POLICY "Allow anyone to insert artists" ON public.artists FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anyone to insert tracks" ON public.tracks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anyone to update track stats" ON public.tracks FOR UPDATE USING (true);

-- ==========================================
-- 2. STORAGE BUCKETS
-- ==========================================

-- Create Buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('audio-assets', 'audio-assets', true),
  ('image-assets', 'image-assets', true)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 3. STORAGE POLICIES (RLS)
-- ==========================================

-- Policy for 'audio-assets'
CREATE POLICY "Public Access Audio" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'audio-assets' );

CREATE POLICY "Public Upload Audio" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'audio-assets' );

-- Policy for 'image-assets'
CREATE POLICY "Public Access Images" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'image-assets' );

CREATE POLICY "Public Upload Images" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'image-assets' );