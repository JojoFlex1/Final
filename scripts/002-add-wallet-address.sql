-- Add wallet address column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS wallet_address TEXT UNIQUE;

-- Add mnemonic column (encrypted) for consolidated wallets
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS encrypted_mnemonic TEXT;

-- Update the auto-create profile function to include wallet generation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, first_name, last_name)
  VALUES (NEW.id, NEW.email, '', '');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
