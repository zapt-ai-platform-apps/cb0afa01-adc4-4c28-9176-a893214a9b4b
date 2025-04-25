import React, { useState } from 'react';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { 
  PlayIcon, 
  PauseIcon, 
  StopIcon, 
  ArrowPathIcon,
  FolderIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function TimeTrackingPage() {
  const { user } = useAuth();
  const [activeTimer, setActiveTimer] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  // Mock time entries for this week - would be fetched from API in real implementation
  const timeEntries = [
    { id: 1, project: 'Website Redesign', task: 'Design homepage mockup', date: 'Monday', hours: 2, minutes: 45 },
    { id: 2, project: 'Website Redesign', task: 'Implement navigation', date: 'Tuesday', hours: 3, minutes: 30 },
    { id: 3, project: 'Marketing Campaign', task: 'Create strategy document', date: 'Tuesday', hours: 1, minutes: 15 },
    { id: 4, project: 'Marketing Campaign', task: 'Design social media assets', date: 'Wednesday', hours: 4, minutes: 0 },
    { id: 5, project: 'Website Redesign', task: 'Cross-browser testing', date: 'Today', hours: 1, minutes: 30 },
  ];
  
  // Mock projects for dropdown
  const projects = [
    { id: 1, name: 'Website Redesign' },
    { id: 2, name: 'Marketing Campaign' }
  ];
  
  // Mock tasks for dropdown
  const tasks = [
    { id: 1, name: 'Design homepage mockup', projectId: 1 },
    { id: 2, name: 'Implement navigation', projectId: 1 },
    { id: 3, name: 'Content migration', projectId: 1 },
    { id: 4, name: 'Cross-browser testing', projectId: 1 },
    { id: 5, name: 'SEO optimization', projectId: 1 },
    { id: 6, name: 'Create strategy document', projectId: 2 },
    { id: 7, name: 'Design social media assets', projectId: 2 },
    { id: 8, name: 'Email sequence', projectId: 2 },
    { id: 9, name: 'PPC ad setup', projectId: 2 },
    { id: 10, name: 'Campaign analytics', projectId: 2 },
  ];
  
  // Format timer display
  const formatTimer = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Format time entry display
  const formatTimeEntry = (hours, minutes) => {
    return `${hours}h ${minutes}m`;
  };
  
  // Calculate total time for the week
  const totalTime = timeEntries.reduce((total, entry) => {
    return total + entry.hours * 60 + entry.minutes;
  }, 0);
  
  const totalHours = Math.floor(totalTime / 60);
  const totalMinutes = totalTime % 60;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Time Tracking</h1>
        <p className="text-text-light">Track time spent on tasks and projects</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Time Tracker */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timer */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-text mb-4">Timer</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-text-light mb-1">
                  Project
                </label>
                <select 
                  className="input box-border"
                  value={activeTimer?.projectId || ''}
                  onChange={(e) => setActiveTimer(prev => ({ 
                    ...prev, 
                    projectId: e.target.value,
                    taskId: '' // Reset task when project changes
                  }))}
                  disabled={isRunning}
                >
                  <option value="">Select a project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-light mb-1">
                  Task
                </label>
                <select 
                  className="input box-border"
                  value={activeTimer?.taskId || ''}
                  onChange={(e) => setActiveTimer(prev => ({ 
                    ...prev, 
                    taskId: e.target.value 
                  }))}
                  disabled={!activeTimer?.projectId || isRunning}
                >
                  <option value="">Select a task</option>
                  {tasks
                    .filter(task => !activeTimer?.projectId || task.projectId.toString() === activeTimer.projectId)
                    .map(task => (
                      <option key={task.id} value={task.id}>{task.name}</option>
                    ))}
                </select>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-between py-6 border-y border-border">
              <div className="text-4xl font-mono mb-4 md:mb-0">
                {formatTimer(timer)}
              </div>
              
              <div className="flex space-x-2">
                {!isRunning ? (
                  <button 
                    className="btn-primary cursor-pointer flex items-center"
                    disabled={!activeTimer?.taskId}
                    onClick={() => setIsRunning(true)}
                  >
                    <PlayIcon className="h-5 w-5 mr-2" />
                    Start
                  </button>
                ) : (
                  <>
                    <button 
                      className="btn-secondary cursor-pointer flex items-center"
                      onClick={() => setIsRunning(false)}
                    >
                      <PauseIcon className="h-5 w-5 mr-2" />
                      Pause
                    </button>
                    <button 
                      className="btn-danger cursor-pointer flex items-center"
                      onClick={() => {
                        setIsRunning(false);
                        setTimer(0);
                      }}
                    >
                      <StopIcon className="h-5 w-5 mr-2" />
                      Stop
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div className="text-sm text-text-light mt-4">
              {isRunning ? (
                <p>
                  Timer running for <span className="font-medium text-text">
                    {projects.find(p => p.id.toString() === activeTimer?.projectId)?.name || 'Unknown Project'}
                  </span> - <span className="font-medium text-text">
                    {tasks.find(t => t.id.toString() === activeTimer?.taskId)?.name || 'Unknown Task'}
                  </span>
                </p>
              ) : (
                <p>Start the timer to track your work</p>
              )}
            </div>
          </div>
          
          {/* Time Sheet */}
          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-text">This Week's Time Entries</h2>
              <button className="text-primary hover:text-primary-dark text-sm flex items-center">
                <ArrowPathIcon className="h-4 w-4 mr-1" />
                Refresh
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-background-secondary">
                    <th className="py-2 px-4 text-left text-xs font-medium text-text-light">Date</th>
                    <th className="py-2 px-4 text-left text-xs font-medium text-text-light">Project</th>
                    <th className="py-2 px-4 text-left text-xs font-medium text-text-light">Task</th>
                    <th className="py-2 px-4 text-right text-xs font-medium text-text-light">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {timeEntries.map(entry => (
                    <tr key={entry.id} className="border-b border-border hover:bg-background-secondary">
                      <td className="py-3 px-4 text-sm">{entry.date}</td>
                      <td className="py-3 px-4 text-sm">{entry.project}</td>
                      <td className="py-3 px-4 text-sm">{entry.task}</td>
                      <td className="py-3 px-4 text-sm text-right font-medium">
                        {formatTimeEntry(entry.hours, entry.minutes)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-background-secondary">
                    <td colSpan="3" className="py-3 px-4 text-sm font-medium">
                      Total
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-bold">
                      {formatTimeEntry(totalHours, totalMinutes)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Weekly Summary */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-text mb-4">Weekly Summary</h2>
            
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-border">
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm text-text">Total Time</span>
              </div>
              <span className="text-lg font-bold">
                {totalHours}h {totalMinutes}m
              </span>
            </div>
            
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-border">
              <div className="flex items-center">
                <FolderIcon className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm text-text">Projects</span>
              </div>
              <span className="text-lg font-bold">
                {new Set(timeEntries.map(e => e.project)).size}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-sm text-text">Tasks</span>
              </div>
              <span className="text-lg font-bold">
                {new Set(timeEntries.map(e => e.task)).size}
              </span>
            </div>
          </div>
          
          {/* Recent Projects */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-text mb-4">Project Breakdown</h2>
            
            {/* Project time breakdown */}
            {(() => {
              const projectTimes = {};
              timeEntries.forEach(entry => {
                if (!projectTimes[entry.project]) {
                  projectTimes[entry.project] = 0;
                }
                projectTimes[entry.project] += entry.hours * 60 + entry.minutes;
              });
              
              return Object.entries(projectTimes).map(([project, minutes]) => {
                const hours = Math.floor(minutes / 60);
                const mins = minutes % 60;
                const percentage = (minutes / totalTime) * 100;
                
                return (
                  <div key={project} className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{project}</span>
                      <span>{hours}h {mins}m</span>
                    </div>
                    <div className="w-full bg-background h-2 rounded-full">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}