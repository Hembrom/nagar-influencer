// src/lib/supabase/influencers.ts
// Helper functions for influencer management with source tracking

import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";

export type Influencer = Database["public"]["Tables"]["influencers"]["Row"];
export type InfluencerSource = "self-registered" | "admin-added";

// Add influencer (by admin)
export async function addInfluencerByAdmin(influencerData: Omit<Influencer, 'id' | 'source' | 'created_at' | 'updated_at'>) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('influencers')
    .insert([
      {
        ...influencerData,
        source: 'admin-added',
      } as Database["public"]["Tables"]["influencers"]["Insert"],
    ])
    .select();

  if (error) throw error;
  return data;
}

// Add influencer (self-registered)
export async function addInfluencerSelfRegistered(influencerData: Omit<Influencer, 'id' | 'source' | 'created_at' | 'updated_at'>) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('influencers')
    .insert([
      {
        ...influencerData,
        source: 'self-registered',
      } as Database["public"]["Tables"]["influencers"]["Insert"],
    ])
    .select();

  if (error) throw error;
  return data;
}

// Get all influencers with optional source filter
export async function getAllInfluencers(source?: InfluencerSource) {
  const supabase = createClient();
  
  let query = supabase
    .from('influencers')
    .select('*');

  if (source) {
    query = query.eq('source', source);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data as Influencer[];
}

// Get self-registered influencers
export async function getSelfRegisteredInfluencers() {
  return getAllInfluencers('self-registered');
}

// Get admin-added influencers
export async function getAdminAddedInfluencers() {
  return getAllInfluencers('admin-added');
}

// Get influencer by ID
export async function getInfluencerById(id: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('influencers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Influencer;
}

// Update influencer
export async function updateInfluencer(id: string, updates: Partial<Influencer>) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('influencers')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data;
}

// Delete influencer
export async function deleteInfluencer(id: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('influencers')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Get statistics
export async function getInfluencerStats() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('influencers')
    .select('source')
    .then(async (res) => {
      if (res.error) throw res.error;
      
      const all = res.data?.length || 0;
      const selfRegistered = res.data?.filter(i => i.source === 'self-registered').length || 0;
      const adminAdded = res.data?.filter(i => i.source === 'admin-added').length || 0;
      
      return {
        total: all,
        selfRegistered,
        adminAdded,
      };
    });

  return error ? null : data;
}
