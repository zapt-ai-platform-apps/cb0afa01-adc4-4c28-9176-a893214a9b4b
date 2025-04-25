import React from 'react';

export default function OKRCard({ okr }) {
  // Determine progress status color
  const getProgressColor = (progress) => {
    if (progress >= 70) return 'text-success';
    if (progress >= 30) return 'text-warning';
    return 'text-danger';
  };
  
  // Format period
  const formatPeriod = (period) => {
    const periodMap = {
      q1: 'Q1',
      q2: 'Q2',
      q3: 'Q3',
      q4: 'Q4',
    };
    
    return periodMap[period] || period.toUpperCase();
  };
  
  return (
    <div className="card overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-text">{okr.title}</h3>
            <div className="flex items-center text-sm text-text-light mt-1">
              <span className="font-medium">{formatPeriod(okr.period)}</span>
              <span className="mx-2">•</span>
              <span>Version {okr.version}</span>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getProgressColor(okr.progressPct)}`}>
              {Math.round(okr.progressPct)}%
            </div>
            <div className="text-xs text-text-light">Overall Progress</div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h4 className="text-sm font-medium text-text-light mb-4">Key Results</h4>
        
        <div className="space-y-6">
          {okr.keyResults.map(kr => {
            const progress = kr.target > 0 ? (kr.current / kr.target) * 100 : 0;
            
            return (
              <div key={kr.id}>
                <div className="flex justify-between items-center mb-1">
                  <h5 className="text-sm font-medium text-text">{kr.title}</h5>
                  <span className="text-sm font-medium text-text">
                    {kr.current} <span className="text-text-light">/ {kr.target}</span>
                  </span>
                </div>
                <div className="w-full bg-background h-2 rounded-full">
                  <div 
                    className={`h-2 rounded-full ${getProgressColor(progress)}`}
                    style={{ width: `${Math.min(100, progress)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}