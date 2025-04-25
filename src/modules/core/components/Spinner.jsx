import React from 'react';
import { twMerge } from 'tailwind-merge';

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-3',
  xl: 'w-12 h-12 border-4',
};

export default function Spinner({ size = 'md', className }) {
  return (
    <div 
      className={twMerge(
        "border-primary border-t-transparent rounded-full animate-spin",
        sizeClasses[size],
        className
      )} 
      aria-label="Loading"
    />
  );
}