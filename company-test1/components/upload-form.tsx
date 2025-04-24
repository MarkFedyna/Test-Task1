import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  IconButton,
  Box,
} from '@mui/material';
import { ChangeEvent, useState, useRef } from 'react';
import { supabase } from '@/app/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import DeleteIcon from '@mui/icons-material/Delete';

interface UploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUploaded: () => void;
}

const UploadDialog = ({ open, onClose, onUploaded }: UploadDialogProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!files.length) return;
    setUploading(true);

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      console.error('Помилка авторизації');
      setUploading(false);
      return;
    }

    const userId = session.user.id;

    for (const file of files) {
      const filePath = `user-${userId}/${uuidv4()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Помилка завантаження:', uploadError.message);
        continue;
      }

      const { data: publicUrlData } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData?.publicUrl;

      if (publicUrl) {
        const { error: dbError } = await supabase.from('photos').insert([
          {
            id: uuidv4(),
            user_id: userId,
            path: publicUrl,
          },
        ]);
        if (dbError) {
          console.error('Помилка збереження в БД:', dbError.message);
        }
      }
    }

    setFiles([]);
    setUploading(false);
    onUploaded();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle>Додати фото</DialogTitle>
      <DialogContent>
        <Typography variant='body1' sx={{ mb: 2 }}>
          Оберіть зображення для завантаження:
        </Typography>

        <input
          type='file'
          hidden
          multiple
          accept='image/*'
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        <Button variant='contained' onClick={handleClick} disabled={uploading}>
          {uploading ? 'Завантаження...' : 'Оберіть файл'}
        </Button>

        {files.length > 0 && (
          <Box mt={2}>
            <Typography variant='subtitle1'>Попередній перегляд:</Typography>
            <Grid container spacing={2} mt={1}>
              {files.map((file, index) => (
                <Grid item xs={4} key={index}>
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: 100,
                      overflow: 'hidden',
                      borderRadius: 1,
                      border: '1px solid #ccc',
                    }}
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview-${index}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <IconButton
                      size='small'
                      onClick={() => handleRemoveFile(index)}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        bgcolor: 'rgba(255,255,255,0.7)',
                      }}
                    >
                      <DeleteIcon fontSize='small' />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={uploading}>
          Скасувати
        </Button>
        <Button
          variant='contained'
          onClick={handleUpload}
          disabled={uploading || files.length === 0}
        >
          Завантажити
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadDialog;
