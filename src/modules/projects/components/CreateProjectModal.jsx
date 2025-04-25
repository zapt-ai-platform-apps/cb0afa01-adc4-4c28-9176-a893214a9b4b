import React, { useState } from 'react';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import * as Sentry from '@sentry/browser';

export default function CreateProjectModal({ isOpen, onClose, onProjectCreated }) {
  const { session } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    colour: '#38bdf8',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Project name is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/addProject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create project');
      }
      
      const result = await response.json();
      toast.success('Project created successfully');
      
      // Reset form
      setFormData({
        name: '',
        startDate: '',
        endDate: '',
        colour: '#38bdf8',
      });
      
      // Close modal and refresh projects
      onClose();
      onProjectCreated(result.project);
    } catch (error) {
      console.error('Error creating project:', error);
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
                    Create New Project
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
                      Project Name*
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
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label 
                        htmlFor="startDate" 
                        className="block text-sm font-medium text-text mb-1"
                      >
                        Start Date
                      </label>
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        className="input box-border"
                        value={formData.startDate}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label 
                        htmlFor="endDate" 
                        className="block text-sm font-medium text-text mb-1"
                      >
                        End Date
                      </label>
                      <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        className="input box-border"
                        value={formData.endDate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label 
                      htmlFor="colour" 
                      className="block text-sm font-medium text-text mb-1"
                    >
                      Color
                    </label>
                    <input
                      type="color"
                      id="colour"
                      name="colour"
                      className="h-10 w-full rounded-md border-border cursor-pointer"
                      value={formData.colour}
                      onChange={handleChange}
                    />
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
                      {isSubmitting ? 'Creating...' : 'Create Project'}
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