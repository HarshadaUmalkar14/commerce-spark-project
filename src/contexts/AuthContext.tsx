
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Set up auth state listener
  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check for pending cart when auth state changes to signed_in
        if (event === 'SIGNED_IN' && sessionStorage.getItem('pendingCart')) {
          console.log("Found pending cart, redirecting to checkout");
          sessionStorage.removeItem('pendingCart');
          // Use setTimeout to avoid router conflicts
          setTimeout(() => {
            window.location.href = '/checkout';
          }, 100);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("Attempting login for:", email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      console.log("Login successful for:", email);
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
      });
      
      // Don't redirect here; it will be handled by onAuthStateChange
    } catch (error: any) {
      // Check if the error is related to email verification
      if (error.message.includes('Email not confirmed')) {
        toast({
          title: 'Email not verified',
          description: 'Please check your inbox and verify your email before logging in.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Login failed',
          description: error.message || 'Something went wrong',
          variant: 'destructive',
        });
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          },
        }
      });
      
      if (error) throw error;
      
      // Check if email confirmation is required
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        toast({
          title: 'User already exists',
          description: 'This email is already registered. Please log in instead.',
          variant: 'destructive',
        });
        return;
      }
      
      toast({
        title: 'Registration successful',
        description: data.session ? 'Welcome to ShopSpark!' : 'Please check your email for verification instructions.',
      });
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: 'Logged out',
        description: 'You have been logged out successfully.',
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
