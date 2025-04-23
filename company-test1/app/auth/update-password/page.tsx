'use client';

import { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  Alert,
} from '@mui/material';
import { supabase } from '@/app/supabaseClient';
import { useRouter } from 'next/navigation';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleUpdate = async () => {
    setError('');
    setMessage('');

    if (!password || !confirmPassword) {
      setError('Будь ласка, заповніть обидва поля');
      return;
    }

    if (password !== confirmPassword) {
      setError('Паролі не співпадають');
      return;
    }

    const {
      data: { user },
      error: sessionError,
    } = await supabase.auth.getUser();

    if (sessionError || !user) {
      setError('Не вдалося отримати користувача');
      return;
    }

    const { data: userDb, error: userError } = await supabase
      .from('user')
      .select('id, password')
      .eq('email', user.email)
      .single();

    if (userDb) {
      const { error: updateError } = await supabase
        .from('user')
        .update({ password })
        .eq('id', userDb.id);
    }

    setMessage('Пароль оновлено успішно');
    setTimeout(() => {
      router.push('/auth/login');
    }, 2000);
  };

  return (
    <Container maxWidth='sm'>
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
          Оновити пароль
        </Typography>

        {error && <Alert severity='error'>{error}</Alert>}
        {message && <Alert severity='success'>{message}</Alert>}

        <TextField
          label='Новий пароль'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />

        <TextField
          label='Підтвердьте пароль'
          type='password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
        />

        <Button
          variant='contained'
          color='primary'
          fullWidth
          onClick={handleUpdate}
        >
          Оновити пароль
        </Button>
      </Box>
    </Container>
  );
}
