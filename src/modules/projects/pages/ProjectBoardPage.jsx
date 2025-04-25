import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import Spinner from '@/modules/core/components/Spinner';
import { PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import KanbanBoard from '../components/KanbanBoard';
import CreateTaskModal from '../components/CreateTaskModal';

export default function ProjectBoardPage() {
  const { projectId } = useParams();
  const { session } = useAuth();
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  
  // Fetch project tasks
  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['project', projectId, 'tasks'],
    queryFn: async () => {
      const response = await fetch(`/api/getProjectTasks?projectId=${projectId}`, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch project tasks');
      }
      
      return response.json();
    },
    enabled: !!session?.access_token && !!projectId,
  });
  
  // Organize tasks by status
  const organizedTasks = {
    todo: data?.tasks?.filter(task => task.status === 'todo') || [],
    doing: data?.tasks?.filter(task => task.status === 'doing') || [],
    review: data?.tasks?.filter(task => task.status === 'review') || [],
    done: data?.tasks?.filter(task => task.status === 'done') || [],
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Project Board</h1>
          <p className="text-text-light">Manage and track project tasks</p>
        </div>
        <button
          className="btn-primary cursor-pointer flex items-center"
          onClick={() => setIsCreateTaskModalOpen(true)}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Task
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      ) : isError ? (
        <div className="bg-danger bg-opacity-10 text-danger p-4 rounded-md mb-4">
          <p className="font-medium">Error loading tasks</p>
          <p className="text-sm">{error.message}</p>
          <button 
            onClick={() => refetch()} 
            className="mt-2 flex items-center text-sm font-medium"
          >
            <ArrowPathIcon className="h-4 w-4 mr-1" />
            Try again
          </button>
        </div>
      ) : (
        <KanbanBoard tasks={organizedTasks} onTaskUpdate={() => refetch()} />
      )}
      
      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        projectId={projectId}
        onTaskCreated={() => refetch()}
      />
    </div>
  );
}