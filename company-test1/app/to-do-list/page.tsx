'use client';

import { Grid, Typography, Button, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { DndContext } from '@dnd-kit/core';
import AddModal from '@/components/add-modal';
import Column from '@/components/column';

interface Todo {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
}

export default function ToDoBoard() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
      const { data, error } = await supabase.from('todo').select('*');
      if (error) console.error('Помилка завантаження:', error.message);
      else setTodos(data || []);
    };
    fetchTodos();
  }, []);

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const draggedId = active.id;
    const newStatus = over.id;

    const updatedTodos = todos.map((todo) =>
      todo.id === draggedId ? { ...todo, status: newStatus } : todo
    );

    setTodos(updatedTodos);

    const { error } = await supabase
      .from('todo')
      .update({ status: newStatus })
      .eq('id', draggedId);

    if (error) {
      console.error('Помилка оновлення статусу:', error.message);
    }
  };

  const columns: { title: string; key: Todo['status'] }[] = [
    { title: 'To Do', key: 'todo' },
    { title: 'In Progress', key: 'in_progress' },
    { title: 'Done', key: 'done' },
  ];

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Box style={{ padding: '2rem' }}>
        <Typography variant='h3' align='center' gutterBottom>
          Task Board
        </Typography>
        <Button
          variant='contained'
          onClick={() => setModalOpen(true)} // Open the modal on button click
          sx={{ mb: 3 }}
        >
          Додати задачу
        </Button>
        <Grid container spacing={2}>
          {columns.map((column) => (
            <Grid item xs={12} md={4} key={column.key}>
              <Column column={column} todos={todos} />
            </Grid>
          ))}
        </Grid>
        <AddModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
      </Box>
    </DndContext>
  );
}
