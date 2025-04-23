'use client';

import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { Typography, Box, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  password: string;
  full_name: string;
  created_at: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !authUser) {
        router.push('/auth/login');
        return;
      }

      const { data: userProfile, error: profileError } = await supabase
        .from('user')
        .select('*')
        .eq('user_id', authUser.id)
        .order('id', { ascending: false });

      if (profileError) {
        console.error(
          'Помилка при завантаженні профілю:',
          profileError.message
        );
      } else {
        console.log(userProfile); // Перевірка даних

        setUser({
          id: authUser.id,
          email: authUser.email!,
          password: '', // або не використовуй це поле взагалі
          full_name: userProfile.full_name || 'Невідомо',
          created_at: userProfile.created_at || 'Невідомо',
        });
      }
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <Box mt={5} mx='auto' maxWidth={600}>
      <Typography variant='h4'>Профіль</Typography>
      {user && (
        <>
          <Typography>Email: {user.email}</Typography>
          <Typography>Ім'я: {user.full_name}</Typography>
          <Typography>ID: {user.id}</Typography>
          <Typography>Дата створення: {user.created_at}</Typography>
          <Button variant='contained' onClick={handleLogout} sx={{ mt: 2 }}>
            Вийти
          </Button>
        </>
      )}
    </Box>
  );
}
