-- Complete Database Schema for NagarInfluence Platform
-- Date: 2026-09-20
-- Description: All tables for influencers, clients, campaigns, admins, and system

-- ============================================================
-- 1. INFLUENCERS TABLE
-- ============================================================
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
  status VARCHAR(50) DEFAULT 'verified' CHECK (status IN ('verified', 'pending', 'inactive')),
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

-- ============================================================
-- 2. CLIENTS/BRANDS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  contact_person VARCHAR(255),
  company_website VARCHAR(255),
  category VARCHAR(255),
  location VARCHAR(255),
  bio TEXT,
  logo_url TEXT,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  
  -- Subscription/Account info
  plan VARCHAR(50) DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'enterprise')),
  total_campaigns_created INTEGER DEFAULT 0,
  total_spent NUMERIC(12, 2) DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 3. ADMINS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  
  -- Admin info
  full_name VARCHAR(255),
  phone VARCHAR(20),
  assigned_regions TEXT,
  
  -- Permissions
  role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin', 'moderator')),
  permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Stats
  campaigns_handled INTEGER DEFAULT 0,
  clients_managed INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID
);

-- ============================================================
-- 4. CAMPAIGNS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Campaign Details
  category VARCHAR(255),
  niche VARCHAR(255),
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'brief_received', 'shortlisting', 'negotiating', 'live', 'completed', 'cancelled')),
  content_format VARCHAR(255),
  
  -- Budget & Timeline
  budget_min NUMERIC(12, 2),
  budget_max NUMERIC(12, 2),
  booking_token NUMERIC(12, 2) DEFAULT 500,
  total_budget NUMERIC(12, 2),
  
  -- Timeline
  start_date DATE,
  end_date DATE,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Audience & Requirements
  target_audience TEXT,
  location VARCHAR(255),
  language VARCHAR(255),
  min_followers VARCHAR(50),
  min_engagement_rate NUMERIC(5, 2),
  
  -- Campaign Info
  brief_description TEXT,
  deliverables TEXT,
  number_of_creators INTEGER,
  
  -- Assignment
  assigned_admin_id UUID REFERENCES admins(id),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 5. CAMPAIGN_APPLICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS campaign_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  influencer_id UUID NOT NULL REFERENCES influencers(id) ON DELETE CASCADE,
  
  -- Application Status
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  proposal_text TEXT,
  quoted_rate NUMERIC(12, 2),
  
  -- Timeline
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  responded_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(campaign_id, influencer_id)
);

-- ============================================================
-- 6. DELIVERABLES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS deliverables (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  influencer_id UUID NOT NULL REFERENCES influencers(id) ON DELETE CASCADE,
  
  -- Content Details
  title VARCHAR(255),
  description TEXT,
  format VARCHAR(255),
  content_url TEXT,
  media_url TEXT,
  views INTEGER DEFAULT 0,
  engagement INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'approved', 'rejected', 'published')),
  submission_date TIMESTAMP WITH TIME ZONE,
  approval_date TIMESTAMP WITH TIME ZONE,
  
  -- Payment
  amount_due NUMERIC(12, 2),
  amount_paid NUMERIC(12, 2) DEFAULT 0,
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'completed')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 7. PAYMENTS/TRANSACTIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Type & References
  transaction_type VARCHAR(50) CHECK (transaction_type IN ('booking_token', 'campaign_payment', 'refund', 'platform_fee')),
  campaign_id UUID REFERENCES campaigns(id),
  influencer_id UUID REFERENCES influencers(id),
  client_id UUID REFERENCES clients(id),
  
  -- Amount & Status
  amount NUMERIC(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  
  -- Payment Method
  payment_method VARCHAR(50),
  transaction_id VARCHAR(255),
  receipt_url TEXT,
  
  -- Notes
  description TEXT,
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================
-- 8. MESSAGES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  sender_type VARCHAR(50) CHECK (sender_type IN ('influencer', 'client', 'admin')),
  recipient_id UUID,
  recipient_type VARCHAR(50) CHECK (recipient_type IN ('influencer', 'client', 'admin')),
  
  -- Message Content
  content TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'image', 'video')),
  attachment_url TEXT,
  
  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 9. REVIEWS/RATINGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL,
  reviewer_type VARCHAR(50) CHECK (reviewer_type IN ('influencer', 'client')),
  recipient_id UUID NOT NULL,
  
  -- Review Details
  rating NUMERIC(2, 1) CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 10. ANALYTICS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  influencer_id UUID REFERENCES influencers(id),
  
  -- Metrics
  total_reach INTEGER DEFAULT 0,
  total_impressions INTEGER DEFAULT 0,
  total_clicks INTEGER DEFAULT 0,
  total_conversions INTEGER DEFAULT 0,
  engagement_rate NUMERIC(5, 2) DEFAULT 0,
  
  -- Dates
  date DATE NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(campaign_id, influencer_id, date)
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================

-- Influencers
CREATE INDEX IF NOT EXISTS idx_influencers_email ON influencers(email);
CREATE INDEX IF NOT EXISTS idx_influencers_handle ON influencers(handle);
CREATE INDEX IF NOT EXISTS idx_influencers_source ON influencers(source);
CREATE INDEX IF NOT EXISTS idx_influencers_status ON influencers(status);
CREATE INDEX IF NOT EXISTS idx_influencers_category ON influencers(category);
CREATE INDEX IF NOT EXISTS idx_influencers_created_at ON influencers(created_at DESC);

-- Clients
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON clients(created_at DESC);

-- Admins
CREATE INDEX IF NOT EXISTS idx_admins_username ON admins(username);
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_admins_status ON admins(status);
CREATE INDEX IF NOT EXISTS idx_admins_role ON admins(role);

-- Campaigns
CREATE INDEX IF NOT EXISTS idx_campaigns_client_id ON campaigns(client_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_assigned_admin ON campaigns(assigned_admin_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON campaigns(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_campaigns_category ON campaigns(category);

-- Applications
CREATE INDEX IF NOT EXISTS idx_applications_campaign_id ON campaign_applications(campaign_id);
CREATE INDEX IF NOT EXISTS idx_applications_influencer_id ON campaign_applications(influencer_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON campaign_applications(status);

-- Deliverables
CREATE INDEX IF NOT EXISTS idx_deliverables_campaign_id ON deliverables(campaign_id);
CREATE INDEX IF NOT EXISTS idx_deliverables_influencer_id ON deliverables(influencer_id);
CREATE INDEX IF NOT EXISTS idx_deliverables_status ON deliverables(status);

-- Messages
CREATE INDEX IF NOT EXISTS idx_messages_campaign_id ON messages(campaign_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- Transactions
CREATE INDEX IF NOT EXISTS idx_transactions_campaign_id ON transactions(campaign_id);
CREATE INDEX IF NOT EXISTS idx_transactions_influencer_id ON transactions(influencer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_client_id ON transactions(client_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated to read influencers" ON influencers;
DROP POLICY IF EXISTS "Allow authenticated to insert influencers" ON influencers;
DROP POLICY IF EXISTS "Allow authenticated to update influencers" ON influencers;
DROP POLICY IF EXISTS "Allow authenticated to read clients" ON clients;
DROP POLICY IF EXISTS "Allow authenticated to insert clients" ON clients;
DROP POLICY IF EXISTS "Allow authenticated to update clients" ON clients;
DROP POLICY IF EXISTS "Allow authenticated to read admins" ON admins;
DROP POLICY IF EXISTS "Allow authenticated to read campaigns" ON campaigns;
DROP POLICY IF EXISTS "Allow authenticated to insert campaigns" ON campaigns;
DROP POLICY IF EXISTS "Allow authenticated to update campaigns" ON campaigns;
DROP POLICY IF EXISTS "Allow authenticated to read applications" ON campaign_applications;
DROP POLICY IF EXISTS "Allow authenticated to insert applications" ON campaign_applications;
DROP POLICY IF EXISTS "Allow authenticated to read deliverables" ON deliverables;
DROP POLICY IF EXISTS "Allow authenticated to insert deliverables" ON deliverables;
DROP POLICY IF EXISTS "Allow authenticated to read transactions" ON transactions;
DROP POLICY IF EXISTS "Allow authenticated to insert transactions" ON transactions;
DROP POLICY IF EXISTS "Allow authenticated to read messages" ON messages;
DROP POLICY IF EXISTS "Allow authenticated to insert messages" ON messages;
DROP POLICY IF EXISTS "Allow authenticated to read reviews" ON reviews;
DROP POLICY IF EXISTS "Allow authenticated to insert reviews" ON reviews;
DROP POLICY IF EXISTS "Allow authenticated to read analytics" ON analytics;
DROP POLICY IF EXISTS "Allow authenticated to insert analytics" ON analytics;

-- RLS Policies for Influencers
CREATE POLICY "Allow authenticated to read influencers"
  ON influencers FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated to insert influencers"
  ON influencers FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated to update influencers"
  ON influencers FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for Clients
CREATE POLICY "Allow authenticated to read clients"
  ON clients FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated to insert clients"
  ON clients FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated to update clients"
  ON clients FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for Admins (restricted)
CREATE POLICY "Allow authenticated to read admins"
  ON admins FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Policies for Campaigns
CREATE POLICY "Allow authenticated to read campaigns"
  ON campaigns FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated to insert campaigns"
  ON campaigns FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated to update campaigns"
  ON campaigns FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for Applications
CREATE POLICY "Allow authenticated to read applications"
  ON campaign_applications FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated to insert applications"
  ON campaign_applications FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for Deliverables
CREATE POLICY "Allow authenticated to read deliverables"
  ON deliverables FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated to insert deliverables"
  ON deliverables FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for Transactions
CREATE POLICY "Allow authenticated to read transactions"
  ON transactions FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated to insert transactions"
  ON transactions FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for Messages
CREATE POLICY "Allow authenticated to read messages"
  ON messages FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated to insert messages"
  ON messages FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for Reviews
CREATE POLICY "Allow authenticated to read reviews"
  ON reviews FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated to insert reviews"
  ON reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for Analytics
CREATE POLICY "Allow authenticated to read analytics"
  ON analytics FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated to insert analytics"
  ON analytics FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- OPTIONAL: SAMPLE DATA
-- ============================================================

-- Uncomment to add sample data
/*

-- Insert sample influencers
INSERT INTO influencers (name, email, handle, followers, category, source, status, instagram_url)
VALUES 
  ('Priya Sharma', 'priya@example.com', '@priyanka_beauty', '1.2M', 'Beauty & Fashion', 'self-registered', 'verified', 'https://instagram.com/priyanka_beauty'),
  ('Rahul Kumar', 'rahul@example.com', '@dishguru_ramesh', '854K', 'Food & Travel', 'admin-added', 'verified', 'https://instagram.com/dishguru_ramesh');

-- Insert sample clients
INSERT INTO clients (name, email, contact_person, category, plan, status)
VALUES 
  ('Priya Fashion', 'brand@priyafashion.com', 'Anjali Singh', 'Fashion', 'pro', 'active'),
  ('NutriWell Foods', 'contact@nutriwell.com', 'Vikram Mor', 'Food & Beverage', 'starter', 'active');

-- Insert sample admins
INSERT INTO admins (username, email, password_hash, full_name, role)
VALUES 
  ('admin', 'admin@nagar-influence.com', 'hashed_password_123', 'Admin User', 'admin'),
  ('superadmin', 'superadmin@nagar-influence.com', 'hashed_password_456', 'Super Admin', 'superadmin');

*/
