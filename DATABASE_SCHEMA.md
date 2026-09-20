# NagarInfluence - Complete Database Schema

## 📊 Tables Overview

### **1. INFLUENCERS** - Creator profiles
- **Columns**: id, name, email, handle, followers, category, bio, location, profile_photo
- **Key Fields**: source (self-registered/admin-added), status, social media URLs
- **Relations**: Referenced by campaign_applications, deliverables, messages

### **2. CLIENTS** - Brand/company profiles
- **Columns**: id, name, email, contact_person, company_website, category, logo_url
- **Key Fields**: plan (free/starter/pro/enterprise), status, total_campaigns_created, total_spent
- **Relations**: Has many campaigns

### **3. ADMINS** - Platform administrators
- **Columns**: id, username, email, password_hash, full_name, phone
- **Key Fields**: role (admin/superadmin/moderator), status, permissions, assigned_regions
- **Relations**: Assigned to campaigns, created users

### **4. CAMPAIGNS** - Marketing campaigns
- **Columns**: id, client_id, title, description, status, content_format
- **Key Fields**: 
  - Budget: budget_min, budget_max, booking_token (₹500)
  - Timeline: start_date, end_date
  - Target: min_followers, min_engagement_rate, target_audience
- **Status**: draft → brief_received → shortlisting → negotiating → live → completed
- **Relations**: Has many applications, deliverables, messages, analytics

### **5. CAMPAIGN_APPLICATIONS** - Influencer applications
- **Columns**: id, campaign_id, influencer_id, status, proposal_text, quoted_rate
- **Status**: pending → accepted/rejected/withdrawn
- **Relations**: Links campaigns to influencers

### **6. DELIVERABLES** - Content deliverables
- **Columns**: id, campaign_id, influencer_id, title, content_url, media_url
- **Key Fields**: 
  - Metrics: views, engagement, likes, comments, shares
  - Payment: amount_due, amount_paid, payment_status
- **Status**: pending → submitted → approved → published
- **Relations**: Tracked by analytics

### **7. TRANSACTIONS** - Payment records
- **Columns**: id, transaction_type, campaign_id, influencer_id, client_id
- **Types**: booking_token, campaign_payment, refund, platform_fee
- **Key Fields**: amount, currency, status, payment_method, transaction_id
- **Status**: pending → completed/failed/refunded

### **8. MESSAGES** - Communication between users
- **Columns**: id, campaign_id, sender_id, sender_type, recipient_id, content
- **Types**: text, file, image, video
- **Key Fields**: is_read, read_at, created_at

### **9. REVIEWS** - Campaign ratings & feedback
- **Columns**: id, campaign_id, reviewer_id, recipient_id, rating, comment
- **Scale**: 1-5 stars
- **Relations**: Links users after campaign completion

### **10. ANALYTICS** - Performance metrics
- **Columns**: id, campaign_id, influencer_id, date
- **Metrics**: reach, impressions, clicks, conversions, engagement_rate
- **Purpose**: Track campaign performance daily

---

## 🔗 Table Relationships

```
clients (1) ──→ (many) campaigns
           ├──→ (many) transactions
           └──→ (many) messages

campaigns (1) ──→ (many) campaign_applications
          ├──→ (many) deliverables
          ├──→ (many) messages
          ├──→ (many) transactions
          └──→ (many) analytics

influencers (1) ──→ (many) campaign_applications
            ├──→ (many) deliverables
            ├──→ (many) messages
            ├──→ (many) transactions
            ├──→ (many) reviews
            └──→ (many) analytics

admins (1) ──→ (many) campaigns (assigned_admin_id)
```

---

## 📝 How to Set Up

### **Step 1: Run the Main Schema Script**

1. Go to **Supabase Dashboard** → SQL Editor
2. Click **New Query**
3. Copy entire script from `migrations/00_create_all_tables.sql`
4. Paste and click **Run**

**This will create:**
- ✅ All 10 tables
- ✅ All indexes for performance
- ✅ Row Level Security (RLS)
- ✅ Constraints & relationships

---

### **Step 2: Verify Tables**

1. Go to **Table Editor** in Supabase
2. You should see all these tables:
   - influencers
   - clients
   - admins
   - campaigns
   - campaign_applications
   - deliverables
   - transactions
   - messages
   - reviews
   - analytics

---

### **Step 3: Optional - Add Sample Data**

Uncomment the sample data section at the bottom of the SQL script to insert test data:
- 2 sample influencers
- 2 sample clients
- 2 sample admins

---

## 🔐 Security Features

### **Row Level Security (RLS)**
- All tables have RLS enabled
- Users can only see/edit their own data
- Admins have elevated permissions
- Superadmins manage system

### **Constraints**
- Foreign keys prevent orphaned records
- CHECK constraints validate enum values
- UNIQUE constraints prevent duplicates

### **Indexes**
- Indexes on frequently queried columns (email, status, dates)
- Improves query performance
- Composite indexes on related columns

---

## 📊 Sample Queries

### **Get all active campaigns**
```sql
SELECT * FROM campaigns 
WHERE status != 'cancelled' 
ORDER BY created_at DESC;
```

### **Get influencers by source**
```sql
SELECT source, COUNT(*) as count 
FROM influencers 
GROUP BY source;
```

### **Get campaign applications status**
```sql
SELECT c.title, i.name, ca.status, ca.quoted_rate
FROM campaign_applications ca
JOIN campaigns c ON ca.campaign_id = c.id
JOIN influencers i ON ca.influencer_id = i.id
WHERE ca.status = 'pending';
```

### **Get campaign revenue**
```sql
SELECT c.title, SUM(t.amount) as total_revenue
FROM campaigns c
LEFT JOIN transactions t ON c.id = t.campaign_id
GROUP BY c.id;
```

### **Get influencer earnings**
```sql
SELECT i.name, SUM(t.amount) as total_earnings
FROM influencers i
LEFT JOIN transactions t ON i.id = t.influencer_id
WHERE t.status = 'completed'
GROUP BY i.id;
```

### **Get pending deliverables**
```sql
SELECT c.title, i.name, d.status, d.created_at
FROM deliverables d
JOIN campaigns c ON d.campaign_id = c.id
JOIN influencers i ON d.influencer_id = i.id
WHERE d.status IN ('pending', 'submitted');
```

---

## 🛠️ TypeScript Types (for your app)

```typescript
interface Influencer {
  id: string;
  name: string;
  email: string;
  handle: string;
  followers: string;
  category: string;
  source: 'self-registered' | 'admin-added';
  status: 'verified' | 'pending' | 'inactive';
}

interface Client {
  id: string;
  name: string;
  email: string;
  category: string;
  plan: 'free' | 'starter' | 'pro' | 'enterprise';
  status: 'active' | 'inactive' | 'suspended';
  total_spent: number;
}

interface Campaign {
  id: string;
  client_id: string;
  title: string;
  status: 'draft' | 'brief_received' | 'shortlisting' | 'negotiating' | 'live' | 'completed' | 'cancelled';
  content_format: string;
  budget_min: number;
  budget_max: number;
  booking_token: number;
}

interface Transaction {
  id: string;
  transaction_type: 'booking_token' | 'campaign_payment' | 'refund' | 'platform_fee';
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
}
```

---

## 🚀 Migration Order

1. **First**: `00_create_all_tables.sql` - Creates everything
2. **Then**: `01_create_influencers_table.sql` - (Already covered by above)
3. **Optional**: `add_source_to_influencers.sql` - (Already included above)

---

## 📚 Files Location

```
migrations/
├── 00_create_all_tables.sql (MAIN - Run this first!)
├── 01_create_influencers_table.sql
└── add_source_to_influencers.sql
```

---

## ✅ Checklist

- [ ] Run `00_create_all_tables.sql` in Supabase SQL Editor
- [ ] Verify all 10 tables appear in Table Editor
- [ ] Check that indexes are created
- [ ] (Optional) Uncomment and add sample data
- [ ] Test RLS policies are working
- [ ] Connect your app to use these tables
- [ ] Test CRUD operations

---

**You're all set! Start building.** 🎉
