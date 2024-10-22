'use client';

import { getApiBaseURL } from '../get-api-base-url';
import { getAccessToken, removeTokens, setTokens } from './tokenService';
import fetchWithAuth from './api';

function generateToken(): string {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}


export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  async signUp(_: SignUpParams): Promise<{ error?: string }> {
    // Make API request

    // We do not handle the API, so we'll just generate a token and store it in localStorage.
    const token = generateToken();
    localStorage.setItem('custom-auth-token', token);

    return {};
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams) {
    const { email, password } = params;
      let response:any;
      // Make API request
      response = await fetch(`${getApiBaseURL()}auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });
      if (response.status === 401) {
        return { error: 'Invalid credentials' };
      }
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const authRes = await response.json();
      const { access_token, refresh_token } = authRes.data;
      setTokens(access_token, refresh_token); 
      return {};
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    // Make API request

    // We do not handle the API, so just check if we have a token in localStorage.
    const token = getAccessToken();


    if (!token) {
      return { data: null };
    }
    const response = await fetchWithAuth('users/me');
    const res = await response.json();
    return { data: res.data };
  }

  async signOut(): Promise<{ error?: string }> {
    removeTokens();

    return {};
  }
}

export const authClient = new AuthClient();
