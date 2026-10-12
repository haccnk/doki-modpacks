import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User, Modpack, PlatformConfig, PermissionRequest } from './types';

const STORAGE_URL_KEY = 'doki_supabase_url';
const STORAGE_ANON_KEY = 'doki_supabase_key';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export function getSupabaseConfig(): SupabaseConfig | null {
  const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : null;
  const envUrl = metaEnv ? (metaEnv.VITE_SUPABASE_URL as string) : '';
  const envKey = metaEnv ? (metaEnv.VITE_SUPABASE_ANON_KEY as string) : '';

  if (envUrl && envKey) {
    return { url: envUrl.trim(), anonKey: envKey.trim() };
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    const localUrl = localStorage.getItem(STORAGE_URL_KEY);
    const localKey = localStorage.getItem(STORAGE_ANON_KEY);
    if (localUrl && localKey) {
      return { url: localUrl.trim(), anonKey: localKey.trim() };
    }
  }

  return null;
}

export function saveSupabaseConfig(url: string, anonKey: string): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  if (!url || !anonKey) {
    localStorage.removeItem(STORAGE_URL_KEY);
    localStorage.removeItem(STORAGE_ANON_KEY);
  } else {
    localStorage.setItem(STORAGE_URL_KEY, url.trim());
    localStorage.setItem(STORAGE_ANON_KEY, anonKey.trim());
  }
  cachedClient = null;
}

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config) return null;

  if (!cachedClient) {
    try {
      cachedClient = createClient(config.url, config.anonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        }
      });
    } catch (e) {
      console.warn('[Supabase] Failed to initialize client:', e);
      return null;
    }
  }
  return cachedClient;
}

export async function testSupabaseConnection(configOverride?: SupabaseConfig): Promise<{
  success: boolean;
  message: string;
  tableMissing?: boolean;
}> {
  const config = configOverride || getSupabaseConfig();
  if (!config || !config.url || !config.anonKey) {
    return { success: false, message: 'Supabase URL or Anon Key is missing' };
  }

  try {
    const testClient = createClient(config.url, config.anonKey, {
      auth: { persistSession: false }
    });

    const { data, error } = await testClient
      .from('app_storage')
      .select('key')
      .limit(1);

    if (error) {
      if (error.code === '42P01' || error.message.toLowerCase().includes('does not exist')) {
        return {
          success: false,
          tableMissing: true,
          message: "Connected to Supabase, but the 'app_storage' table does not exist yet. Please run the SQL schema setup in Supabase SQL Editor."
        };
      }
      return { success: false, message: error.message };
    }

    return { 
      success: true, 
      message: 'Successfully connected to Supabase Cloud Database! Real-time global sync is active.' 
    };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Network error connecting to Supabase' };
  }
}

export async function fetchCloudItem<T>(key: string): Promise<T | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('app_storage')
      .select('value')
      .eq('key', key)
      .maybeSingle();

    if (error || !data) return null;
    return data.value as T;
  } catch (err) {
    console.warn(`[Supabase] Error reading '${key}':`, err);
    return null;
  }
}

export async function saveCloudItem(key: string, value: any): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client
      .from('app_storage')
      .upsert({
        key,
        value,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });

    if (error) {
      console.warn(`[Supabase] Error writing '${key}':`, error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn(`[Supabase] Exception writing '${key}':`, err);
    return false;
  }
}

export async function syncAllLocalToCloud(
  modpacks: Modpack[],
  platformConfig: PlatformConfig | null,
  permissionRequests: PermissionRequest[],
  users?: User[]
): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Supabase client is not configured' };
  }

  try {
    const rows: Array<{ key: string; value: any; updated_at: string }> = [
      { key: 'modpacks', value: modpacks, updated_at: new Date().toISOString() },
      { key: 'platform_config', value: platformConfig, updated_at: new Date().toISOString() },
      { key: 'permission_requests', value: permissionRequests, updated_at: new Date().toISOString() }
    ];

    if (users && users.length > 0) {
      rows.push({ key: 'users', value: users, updated_at: new Date().toISOString() });
    }

    const { error } = await client
      .from('app_storage')
      .upsert(rows, { onConflict: 'key' });

    if (error) {
      return { success: false, message: error.message };
    }

    return { 
      success: true, 
      message: `Successfully synchronized ${modpacks.length} modpack(s), ${users?.length || 0} user(s), and platform configurations to Supabase Cloud!` 
    };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Sync failed due to a network error' };
  }
}
