'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/supabaseClient';
import UploadDialog from '@/components/upload-form';
import {
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
} from '@mui/material';

export default function Gallery() {
  const [userId, setUserId] = useState<string | null>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  const fetchUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUserId(user?.id ?? null);
  };

  const fetchPhotos = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('photos')
      .select('id, path')
      .eq('user_id', userId);

    if (!error) setPhotos(data || []);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserId(null);
    setPhotos([]);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) fetchPhotos();
  }, [userId]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant='h5' gutterBottom>
        Мої Фото
      </Typography>

      <Button
        variant='contained'
        sx={{ mb: 2 }}
        onClick={() => setOpenDialog(true)}
      >
        Завантажити нове фото
      </Button>

      <Grid container spacing={2}>
        {photos.map((photo, index) => (
          <Grid item key={index} xs={12} sm={6} md={3}>
            <Card sx={{ height: 220, overflow: 'hidden', borderRadius: 2 }}>
              <CardMedia
                component='img'
                height='50'
                image={photo.path}
                alt='Фото'
                sx={{
                  height: '100%',
                  width: '100%',
                  objectFit: 'cover',
                }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>

      <Button variant='outlined' sx={{ mt: 4 }} onClick={handleLogout}>
        Вийти
      </Button>

      <UploadDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onUploaded={fetchPhotos}
      />
    </Container>
  );
}
