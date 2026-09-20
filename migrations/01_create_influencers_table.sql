-- Create influencers table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS influencers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  handle VARCHAR(255) UNIQUE NOT NULL,
  followers VARCHAR(50),
  category VARCHAR(255),
  bio TEXT,
  location VARCHAR(255),
  profile_photo TEXT,
  status VARCHAR(50) DEFAULT 'verified',
  source VARCHAR(50) DEFAULT 'self-registered' NOT NULL CHECK (source IN ('self-registered', 'admin-added')),
  
  -- Social media links
  instagram_url TEXT,
  youtube_url TEXT,
  tiktok_url TEXT,
  
  -- Profile details
  audience_size VARCHAR(50),
  collaboration_interests TEXT,
  portfolio_links TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Metadata
  created_by UUID,
  updated_by UUID
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_influencers_email ON influencers(email);
CREATE INDEX IF NOT EXISTS idx_influencers_handle ON influencers(handle);
CREATE INDEX IF NOT EXISTS idx_influencers_source ON influencers(source);
CREATE INDEX IF NOT EXISTS idx_influencers_status ON influencers(status);
CREATE INDEX IF NOT EXISTS idx_influencers_category ON influencers(category);
CREATE INDEX IF NOT EXISTS idx_influencers_created_at ON influencers(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE influencers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow authenticated users to read all influencers
CREATE POLICY "Allow authenticated users to read influencers"
  ON influencers FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert new influencers
CREATE POLICY "Allow authenticated users to insert influencers"
  ON influencers FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Allow users to update their own influencer profile
CREATE POLICY "Allow users to update their own profile"
  ON influencers FOR UPDATE
  USING (auth.uid() = created_by OR auth.role() = 'authenticated')
  WITH CHECK (auth.uid() = created_by OR auth.role() = 'authenticated');

-- Allow admins to delete influencers
CREATE POLICY "Allow admins to delete influencers"
  ON influencers FOR DELETE
  USING (auth.role() = 'authenticated');

-- Optional: Insert sample data
-- Uncomment to add test data
/*
INSERT INTO influencers (name, email, handle, followers, category, source, status)
VALUES 
  ('Priya Sharma', 'priya@example.com', '@priyanka_beauty', '1.2M', 'Beauty & Fashion', 'self-registered', 'verified'),
  ('Rahul Kumar', 'rahul@example.com', '@dishguru_ramesh', '854K', 'Food & Travel', 'admin-added', 'verified');
*/
