'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabaseClient';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
} from '@mui/material';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('Login failed: ' + error.message);
    } else {
      alert('Logged in!');
      setEmail('');
      setPassword('');
      router.push('/');
    }
  };

  return (
    <>
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
            Увійти
          </Typography>

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
              onClick={handleLogin}
            >
              Увійти
            </Button>

            <Typography align='center' gap={2}>
              Не маєш акаунта {''}
              <Link href='/auth/registration'>зареєструйся</Link>
            </Typography>

            <Typography align='center' gap={2}>
              <Link href='/auth/reset-password'>Забув пароль</Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </>
  );
}
