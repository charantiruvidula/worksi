'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type UserRole = 'customer' | 'provider';

export interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  memberSince?: string;
  rating?: number;
  completedJobs?: number;
  businessName?: string;
  category?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (email: string, role: UserRole, name?: string) => void;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'worksy_auth_state_v1';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse auth state:', e);
    }
  }, []);

  const saveUser = (newUser: UserProfile | null) => {
    setUser(newUser);
    if (typeof window !== 'undefined') {
      if (newUser) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  };

  const login = (email: string, role: UserRole, name?: string) => {
    const isPro = role === 'provider';
    const newUser: UserProfile = {
      email: email || (isPro ? 'pro@worksy.com' : 'charan@email.com'),
      role,
      name: name || (isPro ? 'Ravi Sharma' : 'Charan Kumar'),
      avatar: isPro
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
      memberSince: '2024',
      rating: isPro ? 4.9 : undefined,
      completedJobs: isPro ? 142 : 12,
      businessName: isPro ? 'Ravi Electricals & AC Care' : undefined,
      category: isPro ? 'Electrical & AC Services' : undefined,
    };
    saveUser(newUser);
  };

  const logout = () => {
    saveUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    if (!user) {
      login('user@worksy.com', newRole);
      return;
    }
    const updated: UserProfile = {
      ...user,
      role: newRole,
      businessName: newRole === 'provider' ? 'Apex Craft & Renovation' : undefined,
      category: newRole === 'provider' ? 'Home Renovation & Carpentry' : undefined,
      rating: newRole === 'provider' ? (user.rating || 4.9) : undefined,
    };
    saveUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
