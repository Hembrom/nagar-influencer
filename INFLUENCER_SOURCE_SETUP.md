# Influencer Source Column Setup Guide

## 📋 Step-by-Step Instructions

### **IMPORTANT: Create Table First!**

The `influencers` table doesn't exist in your database yet. You need to create it first.

---

### **Step 1: Create the Influencers Table (REQUIRED)**

1. Go to **Supabase Dashboard** → Your Project
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the entire SQL script from `migrations/01_create_influencers_table.sql`
5. Paste it into the editor
6. Click **Run**

**The script will:**
- ✅ Create `influencers` table with all columns
- ✅ Add `source` column with default `'self-registered'`
- ✅ Create indexes for performance
- ✅ Enable Row Level Security (RLS)
- ✅ Add RLS policies for authentication

---

### **Step 2: Add Source Column (Optional if table exists)**

If the table already exists but doesn't have the `source` column:

1. Go to **SQL Editor** → **New Query**
2. Copy script from `migrations/add_source_to_influencers.sql`
3. Paste and click **Run**

**The script will:**
- ✅ Add `source` column (if missing)
- ✅ Add constraint for valid values
- ✅ Create index for filtering

---

### **Step 3: Verify the Setup**

1. Go to **Table Editor** in Supabase
2. You should see **influencers** table
3. Check columns:
   - `id` (UUID)
   - `name`, `email`, `handle` (Text)
   - `followers`, `category` (Text)
   - `source` (Text) - should be 'self-registered' or 'admin-added'
   - `created_at`, `updated_at` (Timestamp)
   - Social media URLs
   - etc.

---

### **Step 4: Update Your Application Code**

#### **For SuperAdmin Adding Influencers:**

**File:** `src/app/superadmin/influencers/page.tsx`

```typescript
import { addInfluencerByAdmin } from "@/lib/supabase/influencers";

const handleAddInfluencer = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const newInfluencer = await addInfluencerByAdmin({
      name: formData.name,
      email: formData.email,
      handle: formData.handle,
      followers: formData.followers,
      category: formData.category,
      status: 'verified',
    });

    setInfluencers([...influencers, newInfluencer[0]]);
    setSuccess("Influencer added successfully!");
  } catch (error) {
    setError(error.message);
  }
};
```

---

#### **For Influencers Self-Registering:**

**File:** `src/app/influencer/setup/page.tsx`

```typescript
import { addInfluencerSelfRegistered } from "@/lib/supabase/influencers";

const handleSaveProfile = async () => {
  // ... existing validation ...
  
  try {
    const result = await addInfluencerSelfRegistered({
      name: displayName,
      email: userEmail || sessionStorage.getItem("influencer_email"),
      handle: `@${displayName.toLowerCase().replace(/\s+/g, '_')}`,
      bio: bio,
      location: location,
      category: categories.join(","),
      instagram_url: socialLinks.instagram,
      youtube_url: socialLinks.youtube,
      tiktok_url: socialLinks.tiktok,
      audience_size: audienceSize,
      collaboration_interests: collaborationInterests,
      portfolio_links: portfolioLinks.filter(l => l),
      status: 'verified',
    });

    console.log('Profile saved with source: self-registered');
    // ... rest of logic ...
  } catch (error) {
    console.error('Error saving profile:', error);
    setError('Failed to save profile');
  }
};
```

---

#### **For SuperAdmin Viewing Filtered Influencers:**

**File:** `src/app/superadmin/influencers/page.tsx`

```typescript
import { getAllInfluencers } from "@/lib/supabase/influencers";

useEffect(() => {
  const fetchInfluencers = async () => {
    try {
      const data = await getAllInfluencers(filterSource === "all" ? undefined : filterSource);
      setInfluencers(data);
    } catch (error) {
      console.error('Error fetching influencers:', error);
    }
  };
  
  fetchInfluencers();
}, [filterSource]);
```

---

## 📊 SQL Query Examples

### **View all influencers by source:**
```sql
SELECT source, COUNT(*) as count 
FROM influencers 
GROUP BY source;
```

### **View self-registered influencers:**
```sql
SELECT * FROM influencers 
WHERE source = 'self-registered' 
ORDER BY created_at DESC;
```

### **View admin-added influencers:**
```sql
SELECT * FROM influencers 
WHERE source = 'admin-added' 
ORDER BY created_at DESC;
```

### **Change source for specific influencer:**
```sql
UPDATE influencers 
SET source = 'admin-added' 
WHERE id = 'influencer_id';
```

### **Add sample data:**
```sql
INSERT INTO influencers (name, email, handle, followers, category, source, status)
VALUES 
  ('Priya Sharma', 'priya@example.com', '@priyanka_beauty', '1.2M', 'Beauty & Fashion', 'self-registered', 'verified'),
  ('Rahul Kumar', 'rahul@example.com', '@dishguru_ramesh', '854K', 'Food & Travel', 'admin-added', 'verified');
```

---

## 🐛 Troubleshooting

**Issue:** "relation influencers does not exist"
- **Solution:** Run `migrations/01_create_influencers_table.sql` first!

**Issue:** "column source already exists"
- **Solution:** Table was created with source already. Skip the second migration.

**Issue:** Filter not showing correct counts
- **Solution:** Ensure all records have `source` value set.

**Issue:** Can't insert new influencers
- **Solution:** 
  - Check RLS policies are enabled
  - Verify user is authenticated
  - Check Supabase logs for details

**Issue:** "Failed to run sql query"
- **Solution:** Check that you're running queries in the correct database/project.

---

## 📚 Related Files

- Create Table: `migrations/01_create_influencers_table.sql` ⭐ **RUN THIS FIRST**
- Add Source: `migrations/add_source_to_influencers.sql`
- Helpers: `src/lib/supabase/influencers.ts`
- SuperAdmin UI: `src/app/superadmin/influencers/page.tsx`
- Influencer Setup: `src/app/influencer/setup/page.tsx`

---

## ✅ Checklist

- [ ] Run `01_create_influencers_table.sql` in Supabase SQL Editor
- [ ] Verify table exists in Table Editor
- [ ] Run `add_source_to_influencers.sql` (if needed)
- [ ] Update SuperAdmin code to use helper functions
- [ ] Update Influencer setup code to use helper functions
- [ ] Test adding influencer via SuperAdmin
- [ ] Test self-registering influencer
- [ ] Test filtering by source

---

Done! Your database is now ready. 🎉

