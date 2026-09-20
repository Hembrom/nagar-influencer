# Influencer Source Column Setup Guide

## 📋 Step-by-Step Instructions

### **Step 1: Run the SQL Migration in Supabase**

1. Go to **Supabase Dashboard** → Your Project
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the entire SQL script from `migrations/add_source_to_influencers.sql`
5. Paste it into the editor
6. Click **Run**

**The script will:**
- ✅ Add `source` column (TEXT type)
- ✅ Set default to `'self-registered'`
- ✅ Add CHECK constraint for valid values
- ✅ Create index for performance
- ✅ Update existing records

---

### **Step 2: Verify the Migration**

1. Go to **Table Editor** in Supabase
2. Open the **influencers** table
3. You should see a new **source** column
4. Check that all existing records have `source` = `'self-registered'`

---

### **Step 3: Update Your Application Code**

#### **For SuperAdmin Adding Influencers:**

**Old Code:**
```typescript
const newInfluencer = {
  id: influencers.length + 1,
  name: formData.name,
  email: formData.email,
  // ...
};
```

**New Code:**
```typescript
import { addInfluencerByAdmin } from "@/lib/supabase/influencers";

const newInfluencer = await addInfluencerByAdmin({
  name: formData.name,
  email: formData.email,
  handle: formData.handle,
  followers: formData.followers,
  category: formData.category,
  status: 'verified',
});
```

---

#### **For Influencers Self-Registering:**

**In `/influencer/setup/page.tsx`:**

```typescript
import { addInfluencerSelfRegistered } from "@/lib/supabase/influencers";

const handleSaveProfile = async () => {
  // ... existing validation ...
  
  const profile = {
    name: displayName,
    email: userEmail,
    handle: `@${displayName.toLowerCase().replace(/\s+/g, '_')}`,
    // ... other fields ...
  };
  
  try {
    const result = await addInfluencerSelfRegistered(profile);
    console.log('Profile saved with source: self-registered');
  } catch (error) {
    console.error('Error saving profile:', error);
  }
};
```

---

#### **For SuperAdmin Viewing Filtered Influencers:**

**In `/superadmin/influencers/page.tsx`:**

```typescript
import { getAllInfluencers, getSelfRegisteredInfluencers, getAdminAddedInfluencers } from "@/lib/supabase/influencers";

// Fetch all
const allInfluencers = await getAllInfluencers();

// Fetch filtered
const selfReg = await getSelfRegisteredInfluencers();
const adminAdded = await getAdminAddedInfluencers();

// Fetch stats
const stats = await getInfluencerStats();
console.log(`Total: ${stats.total}, Self: ${stats.selfRegistered}, Admin: ${stats.adminAdded}`);
```

---

### **Step 4: Test the Implementation**

1. **Add new influencer via SuperAdmin:**
   - Go to `/superadmin/influencers`
   - Click "+ Add Influencer"
   - Fill form & submit
   - Check Supabase: should have `source = 'admin-added'`

2. **Self-register new influencer:**
   - Go to `/influencer/login`
   - Complete signup flow
   - Check Supabase: should have `source = 'self-registered'`

3. **Filter in SuperAdmin:**
   - Click filter buttons
   - Verify counts match database

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

---

## 🐛 Troubleshooting

**Issue:** Migration fails with "column already exists"
- **Solution:** Column may already exist. Check table structure first.

**Issue:** Filter not showing correct counts
- **Solution:** Ensure all existing records have `source` value set.

**Issue:** Can't insert new influencers
- **Solution:** Check Supabase RLS (Row Level Security) policies.

---

## 📚 Related Files

- Migration: `migrations/add_source_to_influencers.sql`
- Helpers: `src/lib/supabase/influencers.ts`
- SuperAdmin UI: `src/app/superadmin/influencers/page.tsx`
- Influencer Setup: `src/app/influencer/setup/page.tsx`

---

Done! Your database is now source-aware. 🎉
