import React, { useState } from 'react';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import * as Sentry from '@sentry/browser';

export default function CreateTaskModal({ isOpen, onClose, projectId, onTaskCreated }) {
  const { session } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'todo',
    priority: 'med',
    estimateHours: '',
    dueDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Task name is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/addTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          ...formData,
          projectId,
          estimateHours: formData.estimateHours ? Number(formData.estimateHours) : null,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create task');
      }
      
      const result = await response.json();
      toast.success('Task created successfully');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        status: 'todo',
        priority: 'med',
        estimateHours: '',
        dueDate: '',
      });
      
      // Close modal and refresh tasks
      onClose();
      onTaskCreated(result.task);
    } catch (error) {
      console.error('Error creating task:', error);
      Sentry.captureException(error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white dark:bg-background-secondary p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title 
                    as="h3" 
                    className="text-lg font-medium leading-6 text-text"
                  >
                    Create New Task
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-text-light hover:text-text"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label 
                      htmlFor="name" 
                      className="block text-sm font-medium text-text mb-1"
                    >
                      Task Name*
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="input box-border"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label 
                      htmlFor="description" 
                      className="block text-sm font-medium text-text mb-1"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows="3"
                      className="input box-border"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label 
                        htmlFor="status" 
                        className="block text-sm font-medium text-text mb-1"
                      >
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        className="input box-border"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="todo">To Do</option>
                        <option value="doing">In Progress</option>
                        <option value="review">Review</option>
                        <option value="done">Done</option>
                      </select>
                    </div>
                    <div>
                      <label 
                        htmlFor="priority" 
                        className="block text-sm font-medium text-text mb-1"
                      >
                        Priority
                      </label>
                      <select
                        id="priority"
                        name="priority"
                        className="input box-border"
                        value={formData.priority}
                        onChange={handleChange}
                      >
                        <option value="low">Low</option>
                        <option value="med">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label 
                        htmlFor="estimateHours" 
                        className="block text-sm font-medium text-text mb-1"
                      >
                        Estimate (hours)
                      </label>
                      <input
                        type="number"
                        id="estimateHours"
                        name="estimateHours"
                        min="0"
                        step="0.5"
                        className="input box-border"
                        value={formData.estimateHours}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label 
                        htmlFor="dueDate" 
                        className="block text-sm font-medium text-text mb-1"
                      >
                        Due Date
                      </label>
                      <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        className="input box-border"
                        value={formData.dueDate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      className="btn-secondary cursor-pointer"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary cursor-pointer"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Creating...' : 'Create Task'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}