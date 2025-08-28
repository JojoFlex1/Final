-- E-waste Management Database Schema
-- Fixed version that doesn't require existing users

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  total_points INTEGER DEFAULT 0,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bins table
CREATE TABLE IF NOT EXISTS public.bins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  qr_code TEXT UNIQUE NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  address TEXT,
  accepted_waste_types TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create waste_submissions table (THIS HANDLES PICTURES)
CREATE TABLE IF NOT EXISTS public.waste_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  bin_id UUID REFERENCES public.bins(id) ON DELETE CASCADE,
  waste_type TEXT NOT NULL,
  weight_kg DECIMAL(5, 2),
  photo_url TEXT, -- <-- THIS COLUMN STORES PICTURE URLs
  points_earned INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  blockchain_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE
);

-- Create point_transactions table
CREATE TABLE IF NOT EXISTS public.point_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES public.waste_submissions(id) ON DELETE SET NULL,
  points INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earned', 'redeemed', 'bonus')),
  description TEXT,
  blockchain_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Bins policies (public read access)
CREATE POLICY "Anyone can view active bins" ON public.bins FOR SELECT USING (status = 'active');

-- Waste submissions policies
CREATE POLICY "Users can view own submissions" ON public.waste_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create submissions" ON public.waste_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Point transactions policies
CREATE POLICY "Users can view own transactions" ON public.point_transactions FOR SELECT USING (auth.uid() = user_id);

-- Function to update total points
CREATE OR REPLACE FUNCTION update_user_total_points()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles 
  SET total_points = (
    SELECT COALESCE(SUM(points), 0) 
    FROM public.point_transactions 
    WHERE user_id = NEW.user_id
  )
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update points
DROP TRIGGER IF EXISTS update_points_trigger ON public.point_transactions;
CREATE TRIGGER update_points_trigger
  AFTER INSERT ON public.point_transactions
  FOR EACH ROW EXECUTE FUNCTION update_user_total_points();

-- Function to auto-create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, first_name, last_name)
  VALUES (NEW.id, NEW.email, '', '');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup (only if auth.users exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') THEN
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;
