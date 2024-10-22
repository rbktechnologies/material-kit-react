"use client";
import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { authClient } from '@/lib/auth/client';
import AccountInfo from '@/components/dashboard/account/account-info';
import AccountDetailsForm from '@/components/dashboard/account/account-details-form';

//export const metadata = { title: `Account | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  const [data, setData] = React.useState<User | null | undefined>(null);
  const didMountRef = React.useRef(false);
  const fetchData = async () => {
    const response = await authClient.getUser();
    setData(response.data);
  }
  React.useEffect(() => {
    if (didMountRef.current) {
      fetchData();
    } else {
      didMountRef.current = true;
    }
  }, []);

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Account</Typography>
      </div>
      <Grid container spacing={3}>
        <Grid lg={4} md={6} xs={12}>
          <AccountInfo  user={data}/>
        </Grid>
        <Grid lg={8} md={6} xs={12}>
          <AccountDetailsForm 
          user={data}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
