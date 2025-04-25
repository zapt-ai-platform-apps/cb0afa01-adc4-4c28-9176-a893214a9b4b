import React from 'react';
import { format } from 'date-fns';
import { CheckCircleIcon, CalendarIcon } from '@heroicons/react/24/outline';

export default function TaskCard({ task, onTaskUpdate }) {
  const priorityColors = {
    low: 'bg-success bg-opacity-10 text-success',
    med: 'bg-warning bg-opacity-10 text-warning',
    high: 'bg-danger bg-opacity-10 text-danger'
  };
  
  const priorityLabels = {
    low: 'Low',
    med: 'Medium',
    high: 'High'
  };
  
  const completedSubtasks = task.subtasks?.filter(st => st.done).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <div className="bg-white dark:bg-background p-3 rounded-md shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-border">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-text">{task.name}</h4>
        <span className={`badge text-xs ${priorityColors[task.priority]}`}>
          {priorityLabels[task.priority]}
        </span>
      </div>
      
      {task.description && (
        <p className="text-xs text-text-light mb-3 line-clamp-2">{task.description}</p>
      )}
      
      <div className="flex items-center justify-between text-xs text-text-light">
        <div className="flex items-center">
          {task.assignee ? (
            <div 
              className="h-6 w-6 rounded-full bg-primary-light text-primary-dark flex items-center justify-center"
              title={task.assignee.email}
            >
              {task.assignee.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          ) : (
            <div className="h-6 w-6 rounded-full bg-background-secondary text-text-light flex items-center justify-center">
              ?
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {totalSubtasks > 0 && (
            <div className="flex items-center">
              <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />
              <span>{completedSubtasks}/{totalSubtasks}</span>
            </div>
          )}
          
          {task.dueDate && (
            <div className="flex items-center">
              <CalendarIcon className="h-3.5 w-3.5 mr-1" />
              <span>{format(new Date(task.dueDate), 'MMM d')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}