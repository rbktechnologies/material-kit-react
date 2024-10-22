import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useLoading } from '@/contexts/loading-context';

const Spinner: React.FC = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex={9999}
      sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Spinner;
