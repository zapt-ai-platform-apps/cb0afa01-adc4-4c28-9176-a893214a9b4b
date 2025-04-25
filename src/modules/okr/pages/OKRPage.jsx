import React, { useState } from 'react';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import Spinner from '@/modules/core/components/Spinner';
import { ArrowPathIcon, PlusIcon } from '@heroicons/react/24/outline';
import OKRCard from '../components/OKRCard';

export default function OKRPage() {
  const { session } = useAuth();
  const [isCreatingOKR, setIsCreatingOKR] = useState(false);
  
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['okrs'],
    queryFn: async () => {
      const response = await fetch('/api/getOKRs', {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch OKRs');
      }
      
      return response.json();
    },
    enabled: !!session?.access_token,
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Objectives & Key Results</h1>
          <p className="text-text-light">Track company and team goals</p>
        </div>
        <button
          className="btn-primary cursor-pointer flex items-center"
          onClick={() => setIsCreatingOKR(true)}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New OKR
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      ) : isError ? (
        <div className="bg-danger bg-opacity-10 text-danger p-4 rounded-md mb-4">
          <p className="font-medium">Error loading OKRs</p>
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
          {data?.okrs?.length === 0 ? (
            <div className="text-center py-12 bg-background-secondary rounded-lg">
              <h3 className="text-lg font-medium text-text mb-2">No OKRs defined yet</h3>
              <p className="text-text-light mb-4">Create your first OKR to start tracking progress</p>
              <button
                className="btn-primary cursor-pointer"
                onClick={() => setIsCreatingOKR(true)}
              >
                Create an OKR
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {data?.okrs.map(okr => (
                <OKRCard key={okr.id} okr={okr} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}