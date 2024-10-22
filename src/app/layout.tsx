"use client";

import * as React from 'react';
import type { Viewport } from 'next';
import '@/styles/global.css';
import { UserProvider } from '@/contexts/user-context';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';
import { SnackbarProvider } from '@/contexts/snackbar-context';
import { LoadingProvider } from '@/contexts/loading-context';
import Spinner from '@/lib/spinner';

export const viewport = { width: 'device-width', initialScale: 1 } satisfies Viewport;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <html lang="en">
      <body>
        <LocalizationProvider>
          <UserProvider>
            <ThemeProvider>
              <LoadingProvider>
                <SnackbarProvider>
                  <Spinner />
                  {children}
                </SnackbarProvider>
              </LoadingProvider>
            </ThemeProvider>
          </UserProvider>
        </LocalizationProvider>
      </body>
    </html>
  );
}
