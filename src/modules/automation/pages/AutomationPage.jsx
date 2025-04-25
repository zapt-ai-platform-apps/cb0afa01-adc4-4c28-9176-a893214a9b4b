import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function AutomationPage() {
  const [automations, setAutomations] = useState([
    {
      id: 1,
      name: 'Task Review Notification',
      description: 'Send message to #qa channel when a task is moved to review',
      trigger: { type: 'task_status_changed', conditions: { status: 'review' } },
      action: { type: 'notify_slack', channel: '#qa', message: 'Task moved to review: {{task.name}}' },
      active: true
    },
    {
      id: 2,
      name: 'High Priority Task Assignment',
      description: 'Notify project manager when high priority task is created',
      trigger: { type: 'task_created', conditions: { priority: 'high' } },
      action: { type: 'notify_email', recipient: 'pm@example.com', subject: 'New High Priority Task' },
      active: true
    },
    {
      id: 3,
      name: 'Due Date Reminder',
      description: 'Send reminder email 24 hours before task due date',
      trigger: { type: 'task_due_soon', conditions: { hours_before: 24 } },
      action: { type: 'notify_email', recipient: '{{task.assignee.email}}', subject: 'Task Due Tomorrow' },
      active: false
    }
  ]);
  
  const [isCreating, setIsCreating] = useState(false);
  
  const toggleAutomation = (id) => {
    setAutomations(automations.map(automation => 
      automation.id === id ? { ...automation, active: !automation.active } : automation
    ));
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Automation</h1>
          <p className="text-text-light">Create automated workflows and triggers</p>
        </div>
        <button
          className="btn-primary cursor-pointer flex items-center"
          onClick={() => setIsCreating(true)}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Automation
        </button>
      </div>
      
      <div className="card p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-text">Active Automations</h2>
          <p className="text-sm text-text-light">These automations are running for your organization</p>
        </div>
        
        <div className="space-y-4">
          {automations.map(automation => (
            <div 
              key={automation.id}
              className={`border ${automation.active ? 'border-primary' : 'border-border'} rounded-lg p-4 hover:shadow-sm transition-shadow`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-text">{automation.name}</h3>
                  <p className="text-sm text-text-light mt-1">{automation.description}</p>
                </div>
                <div className="flex items-center">
                  <div className="mr-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      automation.active ? 'bg-success bg-opacity-10 text-success' : 'bg-text-light bg-opacity-10 text-text-light'
                    }`}>
                      {automation.active ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <label className="inline-flex items-center cursor-pointer">
                    <span className="sr-only">Toggle automation</span>
                    <input 
                      type="checkbox"
                      className="sr-only"
                      checked={automation.active}
                      onChange={() => toggleAutomation(automation.id)}
                    />
                    <div className={`relative w-10 h-5 rounded-full transition-colors ${
                      automation.active ? 'bg-primary' : 'bg-text-light bg-opacity-30'
                    }`}>
                      <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${
                        automation.active ? 'transform translate-x-5' : ''
                      }`}></div>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
                <div>
                  <h4 className="text-sm font-semibold text-text-light mb-2">Trigger</h4>
                  <div className="bg-background-secondary rounded-md p-3 text-sm">
                    <p className="mb-1">
                      <span className="font-medium">Type:</span> {automation.trigger.type.replace(/_/g, ' ')}
                    </p>
                    <p>
                      <span className="font-medium">Conditions:</span>{' '}
                      {Object.entries(automation.trigger.conditions).map(([key, value]) => (
                        <span key={key}>{key.replace(/_/g, ' ')}: {value}</span>
                      ))}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-text-light mb-2">Action</h4>
                  <div className="bg-background-secondary rounded-md p-3 text-sm">
                    <p className="mb-1">
                      <span className="font-medium">Type:</span> {automation.action.type.replace(/_/g, ' ')}
                    </p>
                    {automation.action.type === 'notify_slack' && (
                      <>
                        <p className="mb-1"><span className="font-medium">Channel:</span> {automation.action.channel}</p>
                        <p><span className="font-medium">Message:</span> {automation.action.message}</p>
                      </>
                    )}
                    {automation.action.type === 'notify_email' && (
                      <>
                        <p className="mb-1"><span className="font-medium">Recipient:</span> {automation.action.recipient}</p>
                        <p><span className="font-medium">Subject:</span> {automation.action.subject}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}