import { supabase, Profile, User } from '../lib/supabase';
import { AuthError, User as SupabaseUser } from '@supabase/supabase-js';

export interface AuthResponse {
  user?: User;
  error?: string;
}

export interface SignUpData {
  email: string;
  password: string;
  username: string;
  fullName: string;
  languagePreference: 'en' | 'my';
}

export interface SignInData {
  email: string;
  password: string;
}

class AuthService {
  async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        return { error: authError.message };
      }

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            username: data.username,
            full_name: data.fullName,
            language_preference: data.languagePreference,
          });

        if (profileError) {
          return { error: profileError.message };
        }

        return { user: { id: authData.user.id, email: authData.user.email! } };
      }

      return { error: 'Failed to create user' };
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  }

  async signIn(data: SignInData): Promise<AuthResponse> {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        return { error: error.message };
      }

      if (authData.user) {
        const profile = await this.getProfile(authData.user.id);
        return {
          user: {
            id: authData.user.id,
            email: authData.user.email!,
            profile: profile || undefined,
          },
        };
      }

      return { error: 'Failed to sign in' };
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  }

  async signOut(): Promise<{ error?: string }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { error: error.message };
      }
      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const profile = await this.getProfile(user.id);
        return {
          id: user.id,
          email: user.email!,
          profile: profile || undefined,
        };
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  async getProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        return null;
      }

      return data;
    } catch (error) {
      return null;
    }
  }

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<{ error?: string }> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await this.getProfile(session.user.id);
        callback({
          id: session.user.id,
          email: session.user.email!,
          profile: profile || undefined,
        });
      } else {
        callback(null);
      }
    });
  }
}

export const authService = new AuthService();
