import React from 'react';
import { useAuth } from '@/modules/auth/hooks/useAuth';

export default function AdminPage() {
  const { user } = useAuth();
  
  // Mock audit log data - would be fetched from API in real implementation
  const auditLogs = [
    { id: 1, user: 'admin@creativeco.example', action: 'User Created', resource: 'User', timestamp: '2023-08-15 14:32:45' },
    { id: 2, user: 'admin@creativeco.example', action: 'Project Created', resource: 'Project', timestamp: '2023-08-15 14:35:21' },
    { id: 3, user: 'pm@creativeco.example', action: 'Task Updated', resource: 'Task', timestamp: '2023-08-15 15:12:33' },
    { id: 4, user: 'member@creativeco.example', action: 'Comment Added', resource: 'Comment', timestamp: '2023-08-15 16:05:17' },
    { id: 5, user: 'pm@creativeco.example', action: 'User Invited', resource: 'User', timestamp: '2023-08-16 09:22:08' },
    { id: 6, user: 'admin@creativeco.example', action: 'OKR Created', resource: 'OKR', timestamp: '2023-08-16 10:45:30' },
    { id: 7, user: 'member@creativeco.example', action: 'Task Status Changed', resource: 'Task', timestamp: '2023-08-16 11:18:52' },
    { id: 8, user: 'pm@creativeco.example', action: 'File Uploaded', resource: 'File', timestamp: '2023-08-16 13:30:19' },
  ];
  
  // Organization details - would be fetched from API
  const organization = {
    name: 'CreativeCo',
    plan: 'growth',
    seats: 8,
    usedSeats: 3,
    storageUsed: 256, // MB
    storageLimit: 5120, // 5 GB
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Admin</h1>
        <p className="text-text-light">Organization administration and settings</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Organization Info */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-text mb-4">Organization</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-text-light">Name</p>
              <p className="font-medium">{organization.name}</p>
            </div>
            <div>
              <p className="text-sm text-text-light">Plan</p>
              <div className="flex items-center">
                <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded uppercase mr-2">
                  {organization.plan}
                </span>
                <a href="#" className="text-xs text-primary">Upgrade</a>
              </div>
            </div>
          </div>
        </div>
        
        {/* User Seats */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-text mb-4">Users</h2>
          <div>
            <p className="text-sm text-text-light mb-1">Seats Used</p>
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">{organization.usedSeats} / {organization.seats}</div>
              <a href="#" className="text-xs text-primary">Add Users</a>
            </div>
            <div className="w-full bg-background h-2 rounded-full">
              <div 
                className="bg-primary h-2 rounded-full" 
                style={{ width: `${(organization.usedSeats / organization.seats) * 100}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* Storage */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-text mb-4">Storage</h2>
          <div>
            <p className="text-sm text-text-light mb-1">Storage Used</p>
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">
                {organization.storageUsed >= 1024 
                  ? `${(organization.storageUsed / 1024).toFixed(1)} GB`
                  : `${organization.storageUsed} MB`} / {organization.storageLimit / 1024} GB
              </div>
            </div>
            <div className="w-full bg-background h-2 rounded-full">
              <div 
                className="bg-primary h-2 rounded-full" 
                style={{ width: `${(organization.storageUsed / organization.storageLimit) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Audit Log */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-text mb-4">Audit Log</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-background-secondary">
                <th className="py-2 px-4 text-left text-xs font-medium text-text-light">Timestamp</th>
                <th className="py-2 px-4 text-left text-xs font-medium text-text-light">User</th>
                <th className="py-2 px-4 text-left text-xs font-medium text-text-light">Action</th>
                <th className="py-2 px-4 text-left text-xs font-medium text-text-light">Resource</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map(log => (
                <tr key={log.id} className="border-b border-border hover:bg-background-secondary">
                  <td className="py-3 px-4 text-sm">{log.timestamp}</td>
                  <td className="py-3 px-4 text-sm">{log.user}</td>
                  <td className="py-3 px-4 text-sm font-medium">{log.action}</td>
                  <td className="py-3 px-4 text-sm">{log.resource}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-text-light">Showing 8 of 245 logs</p>
          <div className="flex space-x-2">
            <button className="btn-secondary text-sm cursor-pointer">Previous</button>
            <button className="btn-primary text-sm cursor-pointer">Next</button>
          </div>
        </div>
      </div>
      
      {/* GDPR & Compliance */}
      <div className="card p-6 mt-6">
        <h2 className="text-lg font-semibold text-text mb-4">GDPR & Compliance</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-success">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-text">EU Data Storage</h3>
              <p className="text-xs text-text-light mt-1">All your data is stored in EU-West data centers with AES-256 encryption at rest.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-success">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-text">Automatic Backups</h3>
              <p className="text-xs text-text-light mt-1">30-day point-in-time recovery with weekly encrypted backups to a second region.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-success">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-text">GDPR Compliance</h3>
              <p className="text-xs text-text-light mt-1">All features are built to comply with UK GDPR & DPA regulations.</p>
              <div className="mt-2">
                <a href="#" className="text-xs text-primary mr-3">Privacy Policy</a>
                <a href="#" className="text-xs text-primary mr-3">Terms of Service</a>
                <a href="#" className="text-xs text-primary">Data Processing Agreement</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}