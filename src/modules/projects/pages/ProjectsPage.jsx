import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import Spinner from '@/modules/core/components/Spinner';
import { PlusIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import CreateProjectModal from '../components/CreateProjectModal';

export default function ProjectsPage() {
  const { session } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Fetch projects
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await fetch('/api/getProjects', {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      
      return response.json();
    },
    enabled: !!session?.access_token,
  });
  
  function formatDate(dateString) {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  function getStatusBadgeClass(status) {
    return status === 'active' 
      ? 'bg-success bg-opacity-10 text-success' 
      : 'bg-text-light bg-opacity-10 text-text-light';
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text">Projects</h1>
        <button
          className="btn-primary cursor-pointer flex items-center"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Project
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      ) : isError ? (
        <div className="bg-danger bg-opacity-10 text-danger p-4 rounded-md mb-4">
          <p className="font-medium">Error loading projects</p>
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
        <>
          {data?.projects?.length === 0 ? (
            <div className="text-center py-12 bg-background-secondary rounded-lg">
              <h3 className="text-lg font-medium text-text mb-2">No projects yet</h3>
              <p className="text-text-light mb-4">Create your first project to get started</p>
              <button
                className="btn-primary cursor-pointer"
                onClick={() => setIsCreateModalOpen(true)}
              >
                Create a Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.projects.map(project => (
                <Link 
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="card hover:shadow-md transition-shadow duration-200"
                >
                  <div 
                    className="h-2 rounded-t-lg" 
                    style={{ backgroundColor: project.colour || '#38bdf8' }}
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h2 className="text-lg font-semibold text-text">{project.name}</h2>
                      <span className={`badge ${getStatusBadgeClass(project.status)}`}>
                        {project.status === 'active' ? 'Active' : 'Archived'}
                      </span>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-text-light">Start</p>
                        <p className="font-medium">{formatDate(project.startDate)}</p>
                      </div>
                      <div>
                        <p className="text-text-light">Due</p>
                        <p className="font-medium">{formatDate(project.endDate)}</p>
                      </div>
                      <div className="col-span-2 mt-2">
                        <p className="text-text-light">Team</p>
                        <div className="flex -space-x-2 mt-1">
                          {project.projectMembers?.slice(0, 5).map(member => (
                            <div 
                              key={member.id} 
                              className="h-8 w-8 rounded-full bg-primary-light text-primary flex items-center justify-center border-2 border-white"
                              title={member.user?.email || 'Team member'}
                            >
                              {member.user?.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                          ))}
                          {project.projectMembers?.length > 5 && (
                            <div className="h-8 w-8 rounded-full bg-background-secondary text-text-light flex items-center justify-center border-2 border-white">
                              +{project.projectMembers.length - 5}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
      
      <CreateProjectModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onProjectCreated={() => refetch()}
      />
    </div>
  );
}