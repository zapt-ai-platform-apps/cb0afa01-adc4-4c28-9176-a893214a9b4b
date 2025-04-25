import React from 'react';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import Spinner from '@/modules/core/components/Spinner';

export default function TimelinePage() {
  const { session } = useAuth();
  
  const { data, isLoading, isError, error } = useQuery({
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
  
  // Generate timeline data for demo
  const currentDate = new Date();
  const timelineStart = new Date(currentDate);
  timelineStart.setDate(timelineStart.getDate() - 30);
  const timelineEnd = new Date(currentDate);
  timelineEnd.setDate(timelineEnd.getDate() + 90);
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Timeline</h1>
        <p className="text-text-light">View project timeline and schedule</p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      ) : isError ? (
        <div className="bg-danger bg-opacity-10 text-danger p-4 rounded-md mb-4">
          <p className="font-medium">Error loading timeline data</p>
          <p className="text-sm">{error.message}</p>
        </div>
      ) : (
        <div className="card p-6">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-text">Project Timeline</h2>
            <div className="flex space-x-2">
              <div className="text-xs px-2 py-1 bg-primary bg-opacity-10 text-primary rounded-md">
                Active
              </div>
              <div className="text-xs px-2 py-1 bg-background-secondary text-text-light rounded-md">
                Archived
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Timeline header with months */}
              <div className="flex border-b border-border pb-2 mb-4">
                <div className="w-1/6 font-medium text-text-light text-sm">Project</div>
                <div className="w-5/6 flex">
                  {Array.from({ length: 4 }).map((_, i) => {
                    const month = new Date(currentDate);
                    month.setMonth(month.getMonth() + i - 1);
                    return (
                      <div key={i} className="flex-1 text-center text-sm font-medium text-text-light">
                        {month.toLocaleString('default', { month: 'short' })} {month.getFullYear()}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Projects */}
              {data?.projects?.map(project => {
                const startDate = project.startDate ? new Date(project.startDate) : new Date(currentDate);
                const endDate = project.endDate ? new Date(project.endDate) : new Date(startDate);
                endDate.setDate(endDate.getDate() + 30);
                
                const timelineDays = Math.floor((timelineEnd - timelineStart) / (1000 * 60 * 60 * 24));
                const startOffset = Math.max(0, Math.floor((startDate - timelineStart) / (1000 * 60 * 60 * 24)));
                const endOffset = Math.min(timelineDays, Math.floor((endDate - timelineStart) / (1000 * 60 * 60 * 24)));
                const duration = endOffset - startOffset;
                
                const leftPercentage = (startOffset / timelineDays) * 100;
                const widthPercentage = (duration / timelineDays) * 100;
                
                return (
                  <div key={project.id} className="flex mb-4 items-center">
                    <div className="w-1/6 text-sm font-medium text-text truncate pr-2">
                      {project.name}
                    </div>
                    <div className="w-5/6 relative h-6">
                      <div 
                        className={`absolute top-0 h-full rounded-md ${
                          project.status === 'active' ? 'bg-primary' : 'bg-text-light bg-opacity-30'
                        }`}
                        style={{ 
                          left: `${leftPercentage}%`, 
                          width: `${widthPercentage}%`
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}