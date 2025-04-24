'use client';

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useState } from 'react';
import { supabase } from '@/app/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

interface AddModalProps {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}

export default function AddModal({ modalOpen, setModalOpen }: AddModalProps) {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<'todo' | 'in_progress' | 'done'>('todo');
  const [description, setDescription] = useState('');

  const addTodo = async () => {
    const titleTrim = title.trim();
    const descriptionTrim = description.trim();
    if (!titleTrim || !descriptionTrim) return;

    const newTodo = {
      id: uuidv4(),
      title: titleTrim,
      description: descriptionTrim,
      status,
    };

    const { data, error } = await supabase
      .from('todo')
      .insert([newTodo])
      .select('*');

    if (error) {
      console.error('Помилка додавання:', error.message);
    } else if (data) {
      setTitle('');
      setDescription('');
      setStatus('todo');
      setModalOpen(false);
    }
  };

  return (
    <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth>
      <DialogTitle>Нова задача</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin='dense'
          label='Назва задачі'
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin='dense'
          label='Опис'
          fullWidth
          multiline
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <FormControl fullWidth margin='dense'>
          <InputLabel id='status-label'>Статус</InputLabel>
          <Select
            labelId='status-label'
            value={status}
            label='Статус'
            onChange={(e) =>
              setStatus(e.target.value as 'todo' | 'in_progress' | 'done')
            }
          >
            <MenuItem value='todo'>To Do</MenuItem>
            <MenuItem value='in_progress'>In Progress</MenuItem>
            <MenuItem value='done'>Done</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setModalOpen(false)}>Скасувати</Button>
        <Button onClick={addTodo} variant='contained'>
          Додати
        </Button>
      </DialogActions>
    </Dialog>
  );
}
