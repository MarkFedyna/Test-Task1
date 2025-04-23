'use client';

import { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  Link,
  Alert,
} from '@mui/material';
import { supabase } from '@/app/supabaseClient';
import { useRouter } from 'next/navigation';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async () => {
    setEmail('');
    setError('');
    setMessage('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/auth/update-password',
    });

    if (!email && email.includes('@')) {
      setError('Email не може бути порожнім а також має містити @');
      return;
    }

    if (error) {
      setError(error.message);
    } else {
      setMessage('Лист надіслано вам на пошту');
    }
  };

  return (
    <Container maxWidth={'sm'}>
      <Box
        mt={10}
        p={4}
        boxShadow={3}
        borderRadius={4}
        bgcolor='white'
        display='flex'
        flexDirection='column'
        gap={3}
      >
        <Typography variant='h4' align='center'>
          Відновити пароль
        </Typography>

        {error && <Alert severity='error'>Введіть email</Alert>}
        {message && (
          <Alert severity='success'>Лист успішно надіслано на вашу пошту</Alert>
        )}

        <TextField
          label='Пошта'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />

        <Box display='flex flex-col' gap={2}>
          <Button
            variant='contained'
            color='primary'
            fullWidth
            onClick={handleReset}
          >
            Надіслати лист
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
