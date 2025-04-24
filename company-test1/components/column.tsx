'use client';

import { Typography, Box } from '@mui/material';
import { DropColumn } from './drop-column';
import { TaskCard } from './task-card';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
}

interface ColumnProps {
  column: { title: string; key: Todo['status'] };
  todos: Todo[];
}

const Column = ({ column, todos }: ColumnProps) => {
  return (
    <Box>
      <Typography variant='h5' align='center' gutterBottom>
        {column.title}
      </Typography>
      <DropColumn id={column.key}>
        {todos
          .filter((todo) => todo.status === column.key)
          .map((todo) => (
            <TaskCard key={todo.id} todo={todo} />
          ))}
      </DropColumn>
    </Box>
  );
};

export default Column;
