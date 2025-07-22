import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  // Password + OTP Authentication
  signUp: (email: string, password: string, userData?: {
    username: string;
    fullName: string;
    languagePreference: 'en' | 'my';
    enable2FA?: boolean;
  }) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  // OTP-only Authentication (fallback)
  sendOTP: (email: string, mode: 'signup' | 'signin', userData?: {
    username: string;
    fullName: string;
    languagePreference: 'en' | 'my';
  }) => Promise<{ error?: string }>;
  verifyOTP: (email: string, otp: string, mode: 'signup' | 'signin') => Promise<{ error?: string }>;
  // 2FA Methods
  enable2FA: () => Promise<{ qrCode?: string; secret?: string; error?: string }>;
  verify2FA: (token: string) => Promise<{ error?: string }>;
  disable2FA: () => Promise<{ error?: string }>;
  is2FAEnabled: boolean;
  // Profile Management
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  useEffect(() => {
    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Password + OTP Authentication
  const signUp = async (email: string, password: string, userData?: {
    username: string;
    fullName: string;
    languagePreference: 'en' | 'my';
    enable2FA?: boolean;
  }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData || {}
        }
      });
      
      if (error) {
        return { error: error.message };
      }
      
      if (data.user) {
        setUser(data.user);
        // Enable 2FA if requested
        if (userData?.enable2FA) {
          await enable2FA();
        }
      }
      
      return {};
    } catch (error) {
      return { error: 'Failed to create account' };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        return { error: error.message };
      }
      
      if (data.user) {
        setUser(data.user);
        // Check if 2FA is enabled for this user
        setIs2FAEnabled(data.user.user_metadata?.twoFactorEnabled || false);
      }
      
      return {};
    } catch (error) {
      return { error: 'Failed to sign in' };
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = async (email: string, mode: 'signup' | 'signin', userData?: {
    username: string;
    fullName: string;
    languagePreference: 'en' | 'my';
  }) => {
    setLoading(true);
    try {
      // Use signInWithOtp for both signup and signin
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: mode === 'signup',
          data: userData || {}
        }
      });
      
      if (error) {
        return { error: error.message };
      }
      
      return {};
    } catch (error) {
      return { error: 'Failed to send OTP' };
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (email: string, otp: string, mode: 'signup' | 'signin') => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email' // Use 'email' type for both signup and signin with OTP
      });
      
      if (error) {
        return { error: error.message };
      }
      
      if (data.user) {
        setUser(data.user);
        return {};
      }
      
      return { error: 'OTP verification failed' };
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: any) => {
    if (!user) return { error: 'No user logged in' };
    
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      });
      
      if (error) {
        return { error: error.message };
      }
      
      if (data.user) {
        setUser(data.user);
      }
      
      return {};
    } catch (error) {
      return { error: 'Failed to update profile' };
    }
  };

  // 2FA Methods
  const enable2FA = async () => {
    if (!user) return { error: 'No user logged in' };
    
    try {
      // Generate TOTP secret (simplified implementation)
      const secret = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const qrCode = `otpauth://totp/SateCha:${user.email}?secret=${secret}&issuer=SateCha`;
      
      // Update user metadata with 2FA info
      const { error } = await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
          twoFactorSecret: secret,
          twoFactorEnabled: false // Will be enabled after verification
        }
      });
      
      if (error) {
        return { error: error.message };
      }
      
      return { qrCode, secret };
    } catch (error) {
      return { error: 'Failed to enable 2FA' };
    }
  };

  const verify2FA = async (token: string) => {
    if (!user) return { error: 'No user logged in' };
    
    try {
      // In a real implementation, you would verify the TOTP token
      // For now, we'll accept any 6-digit code
      if (token.length === 6 && /^\d+$/.test(token)) {
        const { error } = await supabase.auth.updateUser({
          data: {
            ...user.user_metadata,
            twoFactorEnabled: true
          }
        });
        
        if (error) {
          return { error: error.message };
        }
        
        setIs2FAEnabled(true);
        return {};
      }
      
      return { error: 'Invalid 2FA code' };
    } catch (error) {
      return { error: 'Failed to verify 2FA' };
    }
  };

  const disable2FA = async () => {
    if (!user) return { error: 'No user logged in' };
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
          twoFactorEnabled: false,
          twoFactorSecret: null
        }
      });
      
      if (error) {
        return { error: error.message };
      }
      
      setIs2FAEnabled(false);
      return {};
    } catch (error) {
      return { error: 'Failed to disable 2FA' };
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signUp,
    signIn,
    sendOTP,
    verifyOTP,
    enable2FA,
    verify2FA,
    disable2FA,
    is2FAEnabled,
    signOut,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
