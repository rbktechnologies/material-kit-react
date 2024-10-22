// src/contexts/snackbar-context.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar, Alert, SnackbarOrigin } from '@mui/material';

interface SnackbarContextType {
  setSnackbarMessage: (message: string) => void;
  setSnackbarSeverity: (severity: 'success' | 'info' | 'warning' | 'error') => void;
  setSnackbarOpen: (open: boolean) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

interface SnackbarProviderProps {
  children: ReactNode;
}

export const SnackbarProvider = ({ children }: SnackbarProviderProps): React.JSX.Element => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('info');

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ setSnackbarMessage, setSnackbarSeverity, setSnackbarOpen }}>
      {children}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' } as SnackbarOrigin}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%', bgcolor: snackbarSeverity === 'success' ? '#95f0df' : '#f5bbb6' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
