import React, { useState } from 'react';
import { useAuth } from '@/modules/auth/hooks/useAuth';

export default function UserSettingsPage() {
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({
    name: user?.user_metadata?.full_name || '',
    title: 'Design Lead',
    email: user?.email || '',
    timezone: 'Europe/London',
  });
  
  const [notifications, setNotifications] = useState({
    email: {
      taskAssigned: true,
      taskDueSoon: true,
      commentsMentions: true,
      weeklyDigest: false
    },
    inApp: {
      taskStatusChange: true,
      newComments: true,
      teamUpdates: true
    }
  });
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNotificationChange = (category, setting) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };
  
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // Would submit to API in real implementation
    alert('Profile saved');
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">User Settings</h1>
        <p className="text-text-light">Manage your account preferences</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="card overflow-hidden">
            <div className="px-4 py-5 flex flex-col items-center border-b border-border">
              <div className="h-20 w-20 rounded-full bg-primary-light text-primary-dark flex items-center justify-center text-3xl font-bold">
                {profileForm.name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <h3 className="mt-4 font-medium text-text">{profileForm.name || user?.email}</h3>
              <p className="text-sm text-text-light">{profileForm.title}</p>
            </div>
            
            <nav className="flex flex-col">
              <button
                className={`px-4 py-3 text-left text-sm font-medium ${
                  activeTab === 'profile' 
                    ? 'bg-primary bg-opacity-10 text-primary border-l-4 border-primary' 
                    : 'text-text-light hover:bg-background-secondary'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </button>
              <button
                className={`px-4 py-3 text-left text-sm font-medium ${
                  activeTab === 'notifications' 
                    ? 'bg-primary bg-opacity-10 text-primary border-l-4 border-primary' 
                    : 'text-text-light hover:bg-background-secondary'
                }`}
                onClick={() => setActiveTab('notifications')}
              >
                Notifications
              </button>
              <button
                className={`px-4 py-3 text-left text-sm font-medium ${
                  activeTab === 'security' 
                    ? 'bg-primary bg-opacity-10 text-primary border-l-4 border-primary' 
                    : 'text-text-light hover:bg-background-secondary'
                }`}
                onClick={() => setActiveTab('security')}
              >
                Security
              </button>
            </nav>
          </div>
        </div>
        
        {/* Content */}
        <div className="md:col-span-3">
          <div className="card p-6">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-lg font-semibold text-text mb-6">Profile Settings</h2>
                
                <form onSubmit={handleProfileSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-text-light mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="input box-border"
                        value={profileForm.name}
                        onChange={handleProfileChange}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-text-light mb-1">
                        Job Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        className="input box-border"
                        value={profileForm.title}
                        onChange={handleProfileChange}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-text-light mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="input box-border bg-background-secondary"
                        value={profileForm.email}
                        readOnly
                        disabled
                      />
                      <p className="mt-1 text-xs text-text-light">
                        Email cannot be changed. Contact an administrator if you need to update it.
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="timezone" className="block text-sm font-medium text-text-light mb-1">
                        Timezone
                      </label>
                      <select
                        id="timezone"
                        name="timezone"
                        className="input box-border"
                        value={profileForm.timezone}
                        onChange={handleProfileChange}
                      >
                        <option value="Europe/London">London (GMT/BST)</option>
                        <option value="Europe/Paris">Paris (CET/CEST)</option>
                        <option value="America/New_York">New York (EST/EDT)</option>
                        <option value="America/Los_Angeles">Los Angeles (PST/PDT)</option>
                        <option value="Asia/Tokyo">Tokyo (JST)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button type="submit" className="btn-primary cursor-pointer">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-lg font-semibold text-text mb-6">Notification Preferences</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-medium text-text mb-3">Email Notifications</h3>
                    <div className="space-y-3">
                      {Object.entries(notifications.email).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <label htmlFor={`email-${key}`} className="text-sm text-text">
                            {key === 'taskAssigned' && 'Task assigned to me'}
                            {key === 'taskDueSoon' && 'Task due date approaching'}
                            {key === 'commentsMentions' && 'Comments and @mentions'}
                            {key === 'weeklyDigest' && 'Weekly digest of project activity'}
                          </label>
                          <div className="relative inline-block w-10 align-middle select-none">
                            <input
                              type="checkbox"
                              id={`email-${key}`}
                              className="sr-only"
                              checked={value}
                              onChange={() => handleNotificationChange('email', key)}
                            />
                            <div className={`block w-10 h-5 rounded-full transition-colors ${
                              value ? 'bg-primary' : 'bg-text-light bg-opacity-30'
                            }`}>
                              <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${
                                value ? 'transform translate-x-5' : ''
                              }`}></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium text-text mb-3">In-App Notifications</h3>
                    <div className="space-y-3">
                      {Object.entries(notifications.inApp).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <label htmlFor={`inapp-${key}`} className="text-sm text-text">
                            {key === 'taskStatusChange' && 'Task status changes'}
                            {key === 'newComments' && 'New comments on tasks'}
                            {key === 'teamUpdates' && 'Team membership updates'}
                          </label>
                          <div className="relative inline-block w-10 align-middle select-none">
                            <input
                              type="checkbox"
                              id={`inapp-${key}`}
                              className="sr-only"
                              checked={value}
                              onChange={() => handleNotificationChange('inApp', key)}
                            />
                            <div className={`block w-10 h-5 rounded-full transition-colors ${
                              value ? 'bg-primary' : 'bg-text-light bg-opacity-30'
                            }`}>
                              <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${
                                value ? 'transform translate-x-5' : ''
                              }`}></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button className="btn-primary cursor-pointer">
                    Save Preferences
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'security' && (
              <div>
                <h2 className="text-lg font-semibold text-text mb-6">Security Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-medium text-text mb-3">Password</h3>
                    <p className="text-sm text-text-light mb-3">
                      You're using single sign-on for authentication. Please visit your identity provider to update your password.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium text-text mb-3">Two-Factor Authentication</h3>
                    <p className="text-sm text-text-light mb-3">
                      Add an extra layer of security to your account by enabling two-factor authentication.
                    </p>
                    <button className="btn-secondary cursor-pointer">
                      Enable 2FA
                    </button>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium text-text mb-3">Active Sessions</h3>
                    <div className="border border-border rounded-md divide-y divide-border">
                      <div className="p-3">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm font-medium text-text">Current Session</p>
                            <p className="text-xs text-text-light">Chrome on Windows • London, UK</p>
                          </div>
                          <span className="badge badge-success">Active Now</span>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm font-medium text-text">Mobile App</p>
                            <p className="text-xs text-text-light">iOS • Last active 3 hours ago</p>
                          </div>
                          <button className="text-xs text-danger">Revoke</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 border-t border-border pt-6">
                  <h3 className="text-md font-medium text-danger mb-3">Danger Zone</h3>
                  <p className="text-sm text-text-light mb-3">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button className="btn-danger cursor-pointer">
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}