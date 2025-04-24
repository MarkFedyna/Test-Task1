'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
}

interface TaskModalProps {
  task: Todo;
  open: boolean;
  onClose: () => void;
}

export const TaskModal = ({ task, open, onClose }: TaskModalProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Деталі задачі</DialogTitle>
      <DialogContent>
        <Typography variant='h6'>{task.title}</Typography>
        <Typography variant='body2' color='text.secondary'>
          {task.description}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Статус: {task.status}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='outlined' color='primary'>
          Закрити
        </Button>
      </DialogActions>
    </Dialog>
  );
};
