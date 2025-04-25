import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('timeByProject');
  
  // Mock data for reports - would be fetched from API in real implementation
  const timeByProjectData = [
    { name: 'Website Redesign', hours: 28 },
    { name: 'Marketing Campaign', hours: 21 },
    { name: 'Mobile App Dev', hours: 14 },
    { name: 'Brand Refresh', hours: 7 },
  ];
  
  const timeByUserData = [
    { name: 'Alice', hours: 32 },
    { name: 'Bob', hours: 24 },
    { name: 'Carol', hours: 18 },
    { name: 'David', hours: 12 },
  ];
  
  const taskStatusData = [
    { name: 'Website Redesign', todo: 4, doing: 6, review: 2, done: 12 },
    { name: 'Marketing Campaign', todo: 3, doing: 4, review: 1, done: 8 },
    { name: 'Mobile App Dev', todo: 5, doing: 3, review: 2, done: 4 },
    { name: 'Brand Refresh', todo: 2, doing: 1, review: 1, done: 3 },
  ];
  
  // Get the appropriate data based on report type
  const getReportData = () => {
    switch (reportType) {
      case 'timeByProject':
        return timeByProjectData;
      case 'timeByUser':
        return timeByUserData;
      case 'taskStatus':
        return taskStatusData;
      default:
        return [];
    }
  };
  
  // Get chart configuration based on report type
  const getChartConfig = () => {
    switch (reportType) {
      case 'timeByProject':
      case 'timeByUser':
        return {
          bars: [
            { dataKey: 'hours', fill: '#38bdf8', name: 'Hours' }
          ],
          xAxisLabel: reportType === 'timeByProject' ? 'Project' : 'User',
          yAxisLabel: 'Hours'
        };
      case 'taskStatus':
        return {
          bars: [
            { dataKey: 'todo', fill: '#94a3b8', name: 'Todo' },
            { dataKey: 'doing', fill: '#38bdf8', name: 'In Progress' },
            { dataKey: 'review', fill: '#fb923c', name: 'Review' },
            { dataKey: 'done', fill: '#22c55e', name: 'Done' }
          ],
          xAxisLabel: 'Project',
          yAxisLabel: 'Tasks'
        };
      default:
        return {
          bars: [],
          xAxisLabel: '',
          yAxisLabel: ''
        };
    }
  };
  
  const reportConfig = getChartConfig();
  const reportData = getReportData();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Reports</h1>
        <p className="text-text-light">Analyze project data and performance</p>
      </div>
      
      <div className="card p-6">
        {/* Report Controls */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold text-text">Project Reports</h2>
            <p className="text-sm text-text-light">Analyze project performance and resource allocation</p>
          </div>
          
          <div className="mt-3 md:mt-0">
            <select 
              className="input box-border"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="timeByProject">Time by Project</option>
              <option value="timeByUser">Time by User</option>
              <option value="taskStatus">Task Status by Project</option>
            </select>
          </div>
        </div>
        
        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={reportData}
              margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                label={{ 
                  value: reportConfig.xAxisLabel, 
                  position: 'insideBottom', 
                  offset: -10 
                }} 
              />
              <YAxis 
                label={{ 
                  value: reportConfig.yAxisLabel, 
                  angle: -90, 
                  position: 'insideLeft' 
                }} 
              />
              <Tooltip />
              <Legend />
              {reportConfig.bars.map((bar, index) => (
                <Bar 
                  key={index}
                  dataKey={bar.dataKey} 
                  fill={bar.fill} 
                  name={bar.name} 
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Report Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-background-secondary">
                <th className="py-2 px-4 text-left text-xs font-medium text-text-light">
                  {reportType === 'timeByProject' ? 'Project' : reportType === 'timeByUser' ? 'User' : 'Project'}
                </th>
                {reportType === 'taskStatus' ? (
                  <>
                    <th className="py-2 px-4 text-right text-xs font-medium text-text-light">Todo</th>
                    <th className="py-2 px-4 text-right text-xs font-medium text-text-light">In Progress</th>
                    <th className="py-2 px-4 text-right text-xs font-medium text-text-light">Review</th>
                    <th className="py-2 px-4 text-right text-xs font-medium text-text-light">Done</th>
                    <th className="py-2 px-4 text-right text-xs font-medium text-text-light">Total</th>
                  </>
                ) : (
                  <th className="py-2 px-4 text-right text-xs font-medium text-text-light">Hours</th>
                )}
              </tr>
            </thead>
            <tbody>
              {reportData.map((item, index) => (
                <tr key={index} className="border-b border-border hover:bg-background-secondary">
                  <td className="py-3 px-4 text-sm font-medium">{item.name}</td>
                  {reportType === 'taskStatus' ? (
                    <>
                      <td className="py-3 px-4 text-sm text-right">{item.todo}</td>
                      <td className="py-3 px-4 text-sm text-right">{item.doing}</td>
                      <td className="py-3 px-4 text-sm text-right">{item.review}</td>
                      <td className="py-3 px-4 text-sm text-right">{item.done}</td>
                      <td className="py-3 px-4 text-sm text-right font-bold">
                        {item.todo + item.doing + item.review + item.done}
                      </td>
                    </>
                  ) : (
                    <td className="py-3 px-4 text-sm text-right font-medium">{item.hours}</td>
                  )}
                </tr>
              ))}
            </tbody>
            {reportType !== 'taskStatus' && (
              <tfoot>
                <tr className="bg-background-secondary">
                  <td className="py-3 px-4 text-sm font-bold">Total</td>
                  <td className="py-3 px-4 text-sm text-right font-bold">
                    {reportData.reduce((sum, item) => sum + item.hours, 0)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}