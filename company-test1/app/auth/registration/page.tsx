'use client';

import { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  Link,
} from '@mui/material';
import { supabase } from '@/app/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Registration() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    if (!email.includes('@') || password.length < 6) {
      return 'Некоректний email або занадто короткий пароль';
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    const { error: insertError } = await supabase.from('user').insert([
      {
        full_name: fullName,
        email: email,
        password: password,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      alert('Registration failed: ' + error.message);
    } else {
      alert('Registration email sent!');
      setFullName('');
      setEmail('');
      setPassword('');
      router.push('/');
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
          Зареєструватися
        </Typography>

        <TextField
          label={`Прізвище, ім'я`}
          type='text'
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          fullWidth
        />

        <TextField
          label='Пошта'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />

        <TextField
          label='Пароль'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />

        <Box display='flex flex-col' gap={2}>
          <Button
            variant='contained'
            color='primary'
            fullWidth
            onClick={handleRegister}
          >
            Зареєструватися
          </Button>

          <Typography align='center' gap={2}>
            Маєш акаунт {''}
            <Link href='/auth/login'>увійти</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
