import React from 'react';
import TaskCard from './TaskCard';

export default function KanbanColumn({ id, title, color, tasks, onTaskUpdate }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center mb-3">
        <div className={`w-3 h-3 rounded-full ${color} mr-2`}></div>
        <h3 className="text-sm font-semibold text-text">{title}</h3>
        <span className="ml-2 text-xs bg-background-secondary rounded-full px-2 py-0.5 text-text-light">
          {tasks.length}
        </span>
      </div>
      
      <div className="flex-1 bg-background-secondary rounded-md p-3 h-full overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-text-light text-sm border-2 border-dashed border-border rounded-md">
            No tasks yet
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onTaskUpdate={onTaskUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}