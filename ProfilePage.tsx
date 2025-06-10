
import React, { useState, useEffect, FormEvent } from 'react';
import { useAuth, useUserManagement } from './store';
import { User, UserStatus } from './types';
import { Input, Button, Modal, Avatar, TrashIcon } from './ui';
import { formatTimestamp, getInitials, getRandomColor } from './utils';
import { AVATAR_COLORS } from './constants';

interface ProfilePageProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string; // ID of the user whose profile is being viewed/edited
  viewMode?: 'view' | 'edit'; // 'view' for other users, 'edit' for current user's profile
}

const ProfilePage: React.FC<ProfilePageProps> = ({ isOpen, onClose, userId, viewMode = 'view' }) => {
  const { currentUser, updateCurrentUser, deleteAccount: deleteCurrentUserAccount } = useAuth();
  const { getUserById, updateUser, users } = useUserManagement(); // users needed to re-check if user exists after potential deletion
  
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(viewMode === 'edit');
  
  // Editable fields
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [avatarBgColor, setAvatarBgColor] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  // const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null);
  // const [newProfilePicturePreview, setNewProfilePicturePreview] = useState<string | null>(null);


  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const userToDisplay = getUserById(userId);
    if (userToDisplay) {
      setProfileUser(userToDisplay);
      setName(userToDisplay.name);
      setNickname(userToDisplay.nickname);
      setAvatarBgColor(userToDisplay.avatarBgColor);
      setAvatarUrl(userToDisplay.avatarUrl);
    } else {
      // User might have been deleted, close modal or show message
      onClose(); 
    }
    setIsEditing(viewMode === 'edit' && currentUser?.id === userId);
  }, [userId, getUserById, viewMode, currentUser, users, onClose]); // Add users to re-fetch if user list changes, and onClose to deps

  const handleSaveChanges = async (e: FormEvent) => {
    e.preventDefault();
    if (!profileUser || !currentUser || currentUser.id !== profileUser.id) return; // Can only edit own profile

    setIsLoading(true);
    setError('');

    const updatedData: Partial<User> = {
      name,
      nickname,
      avatarBgColor,
      // avatarUrl: newProfilePicturePreview || avatarUrl, // If file upload was real
      avatarUrl, // For now, just keep existing or remove
    };

    updateCurrentUser(updatedData); // Updates currentUser in AuthContext (void return)
    const successUserManagement = await updateUser(profileUser.id, updatedData); // Updates user in UserManagementContext

    setIsLoading(false);
    if (successUserManagement) {
      onClose();
    } else {
      setError('Failed to update profile.');
    }
  };

  const handleDeletePicture = () => {
    setAvatarUrl(undefined);
    // setNewProfilePicture(null);
    // setNewProfilePicturePreview(null);
    // If this is the current user, immediately update their avatarUrl to undefined
    if (currentUser && currentUser.id === profileUser?.id) {
      updateCurrentUser({ avatarUrl: undefined });
    }
  };

  const handleChangeAvatarColor = () => {
    const newColor = getRandomColor(AVATAR_COLORS, name || nickname);
    setAvatarBgColor(newColor);
  };

  const handleDeleteOwnAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action is irreversible and will delete all your data.")) {
        setIsLoading(true);
        const success = await deleteCurrentUserAccount();
        setIsLoading(false);
        if (success) {
            onClose(); // Modal will close, app will navigate to login
        } else {
            setError("Failed to delete account. Please try again.");
        }
    }
  };

  // const handlePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     const file = e.target.files[0];
  //     setNewProfilePicture(file);
  //     setNewProfilePicturePreview(URL.createObjectURL(file));
  //   }
  // };

  if (!profileUser) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Profile Not Found">
        <p>The user profile could not be loaded or no longer exists.</p>
      </Modal>
    );
  }
  
  const canEdit = isEditing && currentUser?.id === profileUser.id;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={canEdit ? "Edit Profile" : `${profileUser.name}'s Profile`}
      size="md"
    >
      <form onSubmit={handleSaveChanges} className="space-y-6">
        <div className="flex flex-col items-center">
          <Avatar 
            user={{ 
              name: canEdit ? name : profileUser.name, 
              nickname: canEdit ? nickname : profileUser.nickname, 
              avatarUrl: canEdit ? avatarUrl : profileUser.avatarUrl, 
              avatarBgColor: canEdit ? avatarBgColor : profileUser.avatarBgColor 
            }} 
            size="xl" 
            className="mb-4"
          />
          {canEdit && (
            <div className="flex space-x-2 mb-4">
              {/* <Button type="button" size="sm" variant="ghost" onClick={() => document.getElementById('profilePicUpload')?.click()}>Change Photo</Button>
              <input type="file" id="profilePicUpload" accept="image/*" className="hidden" onChange={handlePictureUpload} /> */}
              { (avatarUrl) && <Button type="button" size="sm" variant="ghost" onClick={handleDeletePicture}>Remove Photo</Button> }
              <Button type="button" size="sm" variant="ghost" onClick={handleChangeAvatarColor}>Change Avatar Color</Button>
            </div>
          )}
        </div>

        {canEdit ? (
          <>
            <Input
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
            <Input
              label="Nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              disabled={isLoading}
            />
          </>
        ) : (
          <>
            <ProfileInfoItem label="Full Name" value={profileUser.name} />
            <ProfileInfoItem label="Nickname" value={`@${profileUser.nickname}`} />
          </>
        )}
        
        <ProfileInfoItem label="Email" value={profileUser.email} />
        <ProfileInfoItem label="Joined" value={formatTimestamp(profileUser.joinedAt, 'date')} />
        <ProfileInfoItem label="Status" value={profileUser.status} 
            statusColor={profileUser.status === UserStatus.Online ? 'text-green-500' : 'text-secondary-500'} />

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <div className="pt-4 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:justify-end sm:space-x-3">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Close
          </Button>
          {canEdit && (
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Save Changes
            </Button>
          )}
        </div>
        {canEdit && (
             <div className="mt-8 pt-6 border-t border-secondary-200 dark:border-secondary-700">
                <Button 
                    type="button" 
                    variant="danger" 
                    onClick={handleDeleteOwnAccount} 
                    isLoading={isLoading}
                    leftIcon={<TrashIcon />}
                    className="w-full sm:w-auto"
                >
                    Delete My Account
                </Button>
             </div>
        )}
      </form>
    </Modal>
  );
};

const ProfileInfoItem: React.FC<{ label: string; value: string; statusColor?: string }> = ({ label, value, statusColor }) => (
  <div>
    <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400">{label}</p>
    <p className={`text-secondary-800 dark:text-secondary-100 ${statusColor || ''}`}>{value}</p>
  </div>
);


export default ProfilePage;
