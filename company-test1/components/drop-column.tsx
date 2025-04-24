'use client';

import { useDroppable } from '@dnd-kit/core';

export const DropColumn = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} style={{ minHeight: '300px', padding: '10px' }}>
      {children}
    </div>
  );
};
