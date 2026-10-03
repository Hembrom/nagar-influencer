-- Insert ashutosh kalbande into influencers table
INSERT INTO public.influencers (
  name,
  email,
  handle,
  profile_photo,
  category,
  source,
  status
)
VALUES (
  'ashutosh kalbande',
  'ashutoshkalbande@gmail.com',
  'ashutosh_kalbande',
  'https://lh3.googleusercontent.com/a/ACg8ocKNpG6Ss6b535-k1_Liem3xzGDiVmmK9Auc0SFQv0lF0n3V9-BM=s96-c',
  'Other',
  'self-registered',
  'verified'
)
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  handle = EXCLUDED.handle,
  profile_photo = COALESCE(influencers.profile_photo, EXCLUDED.profile_photo),
  updated_at = now();

-- Verify
SELECT email, name, handle FROM public.influencers WHERE email = 'ashutoshkalbande@gmail.com';
