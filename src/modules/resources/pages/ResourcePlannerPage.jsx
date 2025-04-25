import React from 'react';

export default function ResourcePlannerPage() {
  // Mock data for resource planner - would be fetched from API in real implementation
  const resources = [
    { id: 1, name: 'Alice Smith', role: 'Designer' },
    { id: 2, name: 'Bob Johnson', role: 'Developer' },
    { id: 3, name: 'Carol Williams', role: 'Project Manager' },
  ];
  
  // Generate dates for the next two weeks
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    dates.push(date);
  }
  
  // Mock capacity data (0-8 hours available per day)
  const getCapacity = (resourceId, date) => {
    // Random capacity between 0-8 hours with some pattern
    const day = date.getDay();
    if (day === 0 || day === 6) return 0; // Weekend
    
    // Some planned absences
    if (resourceId === 1 && date.getDate() === today.getDate() + 3) return 0; // Vacation
    if (resourceId === 2 && date.getDate() === today.getDate() + 7) return 0; // Sick day
    
    // Regular work days with some variation
    return 8 - (Math.floor(Math.random() * 5));
  };
  
  // Function to determine cell color based on capacity
  const getCellColor = (hours) => {
    if (hours === 0) return 'bg-danger bg-opacity-10';
    if (hours <= 2) return 'bg-warning bg-opacity-10';
    if (hours <= 5) return 'bg-warning bg-opacity-5';
    return 'bg-success bg-opacity-5';
  };
  
  // Format date for display
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', { weekday: 'short', day: 'numeric' }).format(date);
  };
  
  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Resource Planner</h1>
        <p className="text-text-light">Manage team capacity and availability</p>
      </div>
      
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text">Team Capacity</h2>
          <p className="text-sm text-text-light">2-week view</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-background-secondary">
                <th className="py-3 px-4 text-left text-sm font-medium text-text-light border-b border-border w-40">
                  Team Member
                </th>
                {dates.map((date, index) => (
                  <th 
                    key={index} 
                    className={`py-3 px-2 text-center text-xs font-medium text-text-light border-b border-border ${
                      isToday(date) ? 'bg-primary bg-opacity-5' : ''
                    }`}
                  >
                    {formatDate(date)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {resources.map((resource) => (
                <tr key={resource.id} className="hover:bg-background-secondary">
                  <td className="py-3 px-4 border-b border-border">
                    <div className="font-medium text-text">{resource.name}</div>
                    <div className="text-xs text-text-light">{resource.role}</div>
                  </td>
                  {dates.map((date, index) => {
                    const capacity = getCapacity(resource.id, date);
                    return (
                      <td 
                        key={index}
                        className={`text-center py-6 px-2 border-b border-border ${getCellColor(capacity)}`}
                      >
                        <div className="text-sm font-medium">{capacity}</div>
                        <div className="text-xs text-text-light">hours</div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}