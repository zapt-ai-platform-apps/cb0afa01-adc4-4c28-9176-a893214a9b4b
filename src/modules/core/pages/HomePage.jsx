import React from 'react';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { Link } from 'react-router-dom';
import { 
  ClockIcon, 
  UserGroupIcon, 
  FolderIcon,
  ArrowLongRightIcon,
  CheckCircleIcon,
  CalendarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-text">Welcome to Aviary</h1>
        <p className="text-text-light">Your all-in-one work management platform</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - Task list */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Tasks */}
          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-text">My Tasks</h2>
              <Link to="/projects" className="text-primary text-sm flex items-center hover:text-primary-dark">
                View all <ArrowLongRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="space-y-3">
              {/* Task items would load from API - showing placeholder */}
              <div className="flex items-center p-3 rounded-md border border-border hover:bg-background-secondary">
                <CheckCircleIcon className="h-5 w-5 text-text-light mr-3" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Update marketing website copy</p>
                  <p className="text-xs text-text-light">Marketing Project • Due tomorrow</p>
                </div>
                <span className="badge badge-warning">Medium</span>
              </div>
              <div className="flex items-center p-3 rounded-md border border-border hover:bg-background-secondary">
                <CheckCircleIcon className="h-5 w-5 text-text-light mr-3" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Finalize Q3 OKRs</p>
                  <p className="text-xs text-text-light">Strategic Planning • Due next week</p>
                </div>
                <span className="badge badge-danger">High</span>
              </div>
              <div className="flex items-center p-3 rounded-md border border-border hover:bg-background-secondary">
                <CheckCircleIcon className="h-5 w-5 text-text-light mr-3" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Review bug reports from QA</p>
                  <p className="text-xs text-text-light">Product Development • Due in 3 days</p>
                </div>
                <span className="badge badge-success">Low</span>
              </div>
            </div>
          </div>
          
          {/* OKR Progress */}
          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-text">OKR Progress</h2>
              <Link to="/okr" className="text-primary text-sm flex items-center hover:text-primary-dark">
                View all <ArrowLongRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-medium">Increase customer satisfaction score to 95%</p>
                  <span className="text-sm font-medium">75%</span>
                </div>
                <div className="w-full bg-background h-2 rounded-full">
                  <div className="bg-success h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-medium">Launch 3 new product features</p>
                  <span className="text-sm font-medium">33%</span>
                </div>
                <div className="w-full bg-background h-2 rounded-full">
                  <div className="bg-warning h-2 rounded-full" style={{ width: '33%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-medium">Reduce customer support response time to under 4 hours</p>
                  <span className="text-sm font-medium">90%</span>
                </div>
                <div className="w-full bg-background h-2 rounded-full">
                  <div className="bg-success h-2 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-text mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/projects" className="flex flex-col items-center justify-center p-4 rounded-md border border-border hover:bg-background-secondary text-center">
                <FolderIcon className="h-6 w-6 text-primary mb-2" />
                <span className="text-sm font-medium">New Project</span>
              </Link>
              <Link to="/time" className="flex flex-col items-center justify-center p-4 rounded-md border border-border hover:bg-background-secondary text-center">
                <ClockIcon className="h-6 w-6 text-primary mb-2" />
                <span className="text-sm font-medium">Track Time</span>
              </Link>
              <Link to="/resources" className="flex flex-col items-center justify-center p-4 rounded-md border border-border hover:bg-background-secondary text-center">
                <UserGroupIcon className="h-6 w-6 text-primary mb-2" />
                <span className="text-sm font-medium">Team</span>
              </Link>
              <Link to="/reports" className="flex flex-col items-center justify-center p-4 rounded-md border border-border hover:bg-background-secondary text-center">
                <ChartBarIcon className="h-6 w-6 text-primary mb-2" />
                <span className="text-sm font-medium">Reports</span>
              </Link>
            </div>
          </div>
          
          {/* Upcoming */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-text mb-4">Upcoming</h2>
            <div className="space-y-3">
              <div className="flex items-center p-3 rounded-md border border-border">
                <CalendarIcon className="h-5 w-5 text-text-light mr-3" />
                <div>
                  <p className="text-sm font-medium">Weekly Team Meeting</p>
                  <p className="text-xs text-text-light">Today, 2:00 PM</p>
                </div>
              </div>
              <div className="flex items-center p-3 rounded-md border border-border">
                <CalendarIcon className="h-5 w-5 text-text-light mr-3" />
                <div>
                  <p className="text-sm font-medium">Project Review</p>
                  <p className="text-xs text-text-light">Tomorrow, 11:00 AM</p>
                </div>
              </div>
              <div className="flex items-center p-3 rounded-md border border-border">
                <CalendarIcon className="h-5 w-5 text-text-light mr-3" />
                <div>
                  <p className="text-sm font-medium">Client Presentation</p>
                  <p className="text-xs text-text-light">Friday, 3:30 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}