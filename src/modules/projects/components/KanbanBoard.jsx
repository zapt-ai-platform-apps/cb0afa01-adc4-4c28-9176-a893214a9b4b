import React from 'react';
import KanbanColumn from './KanbanColumn';

export default function KanbanBoard({ tasks, onTaskUpdate }) {
  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-text-light', tasks: tasks.todo },
    { id: 'doing', title: 'In Progress', color: 'bg-primary', tasks: tasks.doing },
    { id: 'review', title: 'Review', color: 'bg-warning', tasks: tasks.review },
    { id: 'done', title: 'Done', color: 'bg-success', tasks: tasks.done },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {columns.map(column => (
        <KanbanColumn
          key={column.id}
          id={column.id}
          title={column.title}
          color={column.color}
          tasks={column.tasks}
          onTaskUpdate={onTaskUpdate}
        />
      ))}
    </div>
  );
}