'use client';

import { Box, Card, CardContent, Typography } from '@mui/material';
import { useDraggable } from '@dnd-kit/core';
import { useState } from 'react';
import { TaskModal } from './task-modal';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
}

export const TaskCard = ({ todo }: { todo: Todo }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: todo.id,
  });

  const handleCardClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <Box
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
        touchAction: 'none',
        marginBottom: '10px',
        cursor: 'pointer',
      }}
    >
      <Card
        onClick={handleCardClick}
        sx={{ backgroundColor: '#f5f5f5', cursor: 'pointer' }}
      >
        <CardContent>
          <Typography variant='h6'>{todo.title}</Typography>
          <Typography color='text.secondary'>
            Опис: {todo.description}
          </Typography>
          <Typography fontWeight={'bold'} color='text.secondary'>
            Статус: {todo.status}
          </Typography>
        </CardContent>
      </Card>

      <TaskModal task={todo} open={modalOpen} onClose={handleCloseModal} />
    </Box>
  );
};
