
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useSettings, useUserManagement } from './store'; // Changed useTheme to useSettings
import { AppSettings, Theme, User, UserStatus, Language } from './types';
import { Button, Input, Modal, Avatar, TrashIcon, EyeIcon, SunIcon, MoonIcon, ArrowLeftIcon } from './ui';
import { APP_NAME, DEFAULT_APP_SETTINGS } from './constants'; // Changed DEFAULT_USER_SETTINGS
import { formatTimestamp } from './utils';
import ProfilePage from './ProfilePage'; 

interface SettingsAdminPageProps {
  view: 'settings' | 'admin';
}

const SettingsContent: React.FC = () => {
  const { settings, updateSetting } = useSettings();
  const { currentUser, deleteAccount } = useAuth(); // Removed logout as it's part of deleteAccount
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSettingChange = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    updateSetting(key, value);
  };

  const handleDeleteMyAccount = async () => {
    setIsDeleting(true);
    const success = await deleteAccount();
    setIsDeleting(false);
    if (success) {
        setIsDeleteModalOpen(false);
    } else {
        alert("Failed to delete account. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">Settings</h2>
      
      <div className="space-y-6 bg-white dark:bg-secondary-800 p-6 rounded-lg shadow">
        <div className="border-b border-secondary-200 dark:border-secondary-700 pb-4">
          <h3 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200 mb-2">Appearance</h3>
          <div className="flex items-center justify-between">
            <span className="text-secondary-700 dark:text-secondary-300">Theme</span>
            <div className="flex items-center space-x-2 p-1 bg-secondary-100 dark:bg-secondary-700 rounded-full">
              <Button 
                variant={settings.theme === Theme.Light ? 'primary' : 'ghost'} 
                size="sm" 
                onClick={() => handleSettingChange('theme', Theme.Light)}
                className={`rounded-full ${settings.theme === Theme.Light ? '' : 'text-secondary-500 dark:text-secondary-400'}`}
                aria-pressed={settings.theme === Theme.Light}
                aria-label="Set light theme"
              >
                <SunIcon className="w-5 h-5"/>
              </Button>
              <Button 
                variant={settings.theme === Theme.Dark ? 'primary' : 'ghost'} 
                size="sm" 
                onClick={() => handleSettingChange('theme', Theme.Dark)}
                className={`rounded-full ${settings.theme === Theme.Dark ? 'bg-secondary-600 text-white' : 'text-secondary-500 dark:text-secondary-400'}`}
                aria-pressed={settings.theme === Theme.Dark}
                aria-label="Set dark theme"
              >
                <MoonIcon className="w-5 h-5"/>
              </Button>
            </div>
          </div>
        </div>

        <div className="border-b border-secondary-200 dark:border-secondary-700 pb-4">
          <h3 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200 mb-2">Language</h3>
          <select 
            value={settings.language} 
            onChange={(e) => handleSettingChange('language', e.target.value as Language)}
            className="w-full p-2 border border-secondary-300 dark:border-secondary-600 rounded-md bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 focus:ring-primary-500 focus:border-primary-500"
            aria-label="Select language"
          >
            <option value="en">English</option>
            <option value="ar">العربية (Arabic)</option>
          </select>
        </div>

        <div className="border-b border-secondary-200 dark:border-secondary-700 pb-4">
          <h3 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200 mb-2">Notifications</h3>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-secondary-700 dark:text-secondary-300">Enable Notifications</span>
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.notificationsEnabled}
                onChange={(e) => handleSettingChange('notificationsEnabled', e.target.checked)}
                id="notificationsToggle"
              />
              <label htmlFor="notificationsToggle" className="sr-only">Toggle Notifications</label>
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 dark:peer-focus:ring-primary-600 rounded-full peer dark:bg-secondary-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-secondary-500 peer-checked:bg-primary-600"></div>
            </div>
          </label>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200 mb-2">Account</h3>
           <Button 
            variant="danger" 
            className="w-full sm:w-auto" 
            onClick={() => setIsDeleteModalOpen(true)}
            leftIcon={<TrashIcon/>}
            >
            Delete My Account
          </Button>
        </div>
      </div>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Account">
        <p className="text-secondary-700 dark:text-secondary-300 mb-4">
            Are you sure you want to delete your account? This action is permanent and cannot be undone. All your chats and messages will be removed.
        </p>
        <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteMyAccount} isLoading={isDeleting}>Delete Account</Button>
        </div>
      </Modal>
    </div>
  );
};

// Admin Panel View
const AdminPanelContent: React.FC = () => {
  const { users, deleteUserByAdmin, getUserById } = useUserManagement();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeletingUser, setIsDeletingUser] = useState<string | null>(null); 
  const [viewedUser, setViewedUser] = useState<User | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);


  const handleDeleteUser = async (userId: string) => {
    if (userId === currentUser?.id) {
      alert("Admin cannot delete self.");
      return;
    }
    if (window.confirm(`Are you sure you want to delete user ${getUserById(userId)?.nickname}? This is irreversible.`)) {
      setIsDeletingUser(userId);
      await deleteUserByAdmin(userId);
      setIsDeletingUser(null);
    }
  };
  
  const handleViewUser = (userId: string) => {
      const userToView = getUserById(userId);
      if (userToView) {
          setViewedUser(userToView);
          setIsProfileModalOpen(true);
      }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">Admin Panel - User Management</h2>
      <Input 
        type="search" 
        placeholder="Search users by name, nickname, or email..." 
        aria-label="Search users"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6"
        wrapperClassName="mb-6"
      />

      <div className="bg-white dark:bg-secondary-800 shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
          <thead className="bg-secondary-50 dark:bg-secondary-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-300 uppercase tracking-wider">User</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-300 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-300 uppercase tracking-wider">Nickname</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-300 uppercase tracking-wider">Joined</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-300 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-secondary-800 divide-y divide-secondary-200 dark:divide-secondary-700">
            {filteredUsers.map(user => (
              <tr key={user.id} className={`${user.isAdmin ? 'bg-primary-50 dark:bg-primary-900/30' : ''}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Avatar user={user} size="sm" />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-secondary-900 dark:text-secondary-100">{user.name} {user.isAdmin && <span className="text-xs text-primary-600 dark:text-primary-400">(Admin)</span>}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500 dark:text-secondary-300">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500 dark:text-secondary-300">@{user.nickname}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500 dark:text-secondary-300">{formatTimestamp(user.joinedAt, 'date')}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === UserStatus.Online ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' : 'bg-secondary-100 text-secondary-800 dark:bg-secondary-600 dark:text-secondary-200'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleViewUser(user.id)} title="View Profile" aria-label={`View profile of ${user.name}`} className="text-primary-600 hover:text-primary-800">
                    <EyeIcon/>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteUser(user.id)} 
                    disabled={user.id === currentUser?.id || isDeletingUser === user.id}
                    isLoading={isDeletingUser === user.id}
                    title="Delete User"
                    aria-label={`Delete user ${user.name}`}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon/>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && <p className="p-4 text-center text-secondary-500 dark:text-secondary-400">No users found matching your search.</p>}
      </div>
      {viewedUser && (
        <ProfilePage
            isOpen={isProfileModalOpen}
            onClose={() => { setIsProfileModalOpen(false); setViewedUser(null); }}
            userId={viewedUser.id}
            viewMode="view" 
        />
      )}
    </div>
  );
};


const SettingsAdminPage: React.FC<SettingsAdminPageProps> = ({ view }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (view === 'admin' && !currentUser?.isAdmin) {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-secondary-100 dark:bg-secondary-900 text-secondary-700 dark:text-secondary-300">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="mb-6">You do not have permission to view this page.</p>
            <Button onClick={() => navigate('/')} variant="primary">Go to Chats</Button>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-100 dark:bg-secondary-900">
      <header className="bg-white dark:bg-secondary-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Button variant="ghost" onClick={() => navigate('/')} className="mr-4 -ml-2" aria-label="Go back to chats">
            <ArrowLeftIcon className="w-5 h-5"/>
          </Button>
          <h1 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
            {view === 'settings' ? 'Settings' : 'Admin Panel'}
          </h1>
        </div>
      </header>
      <main className="py-6">
        {view === 'settings' ? <SettingsContent /> : <AdminPanelContent />}
      </main>
    </div>
  );
};

export default SettingsAdminPage;
