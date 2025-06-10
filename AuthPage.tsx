
import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from './store';
import { Input, Button, AppLogo, Avatar } from './ui';
import { APP_NAME, AVATAR_COLORS } from './constants';
import { getInitials, getRandomColor } from './utils';
import { User } from './types';

interface AuthPageProps {
  initialView?: 'login' | 'signup';
}

const AuthPage: React.FC<AuthPageProps> = ({ initialView = 'login' }) => {
  const [isLoginView, setIsLoginView] = useState(initialView === 'login');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, currentUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  // const [profilePicture, setProfilePicture] = useState<File | null>(null);
  // const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [avatarBgColor, setAvatarBgColor] = useState(getRandomColor(AVATAR_COLORS, fullName || nickname));
  const [initials, setInitials] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (currentUser) {
      navigate(from, { replace: true });
    }
  }, [currentUser, navigate, from]);
  
  useEffect(() => {
    // Update initials and avatar color when name/nickname changes for signup
    if (!isLoginView) {
      setInitials(getInitials(fullName || nickname));
      if (!fullName && !nickname) { // Pick a new random color if both are empty
         setAvatarBgColor(getRandomColor(AVATAR_COLORS));
      } else {
         setAvatarBgColor(getRandomColor(AVATAR_COLORS, fullName || nickname));
      }
    }
  }, [fullName, nickname, isLoginView]);


  const handleAuthAction = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    let success = false;
    if (isLoginView) {
      success = await login(email, password);
      if (!success) setError('Invalid email or password.');
    } else {
      if (!fullName || !nickname || !email || !password) {
        setError('All fields are required.');
        setIsLoading(false);
        return;
      }
      const signupData = {
        name: fullName,
        nickname,
        email,
        passwordHash: password, // Will be plain text in this mock
        // avatarUrl: profilePicturePreview || undefined, // if file upload was real
      };
      success = await signup({ ...signupData, avatarInitialColorSeed: fullName || nickname });
      if (!success) setError('Failed to create account. Email or nickname might be taken.');
    }

    setIsLoading(false);
    if (success) {
      navigate(from, { replace: true });
    }
  };

  // const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     const file = e.target.files[0];
  //     setProfilePicture(file);
  //     setProfilePicturePreview(URL.createObjectURL(file));
  //   }
  // };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setError('');
    // Reset fields
    setEmail('');
    setPassword('');
    setFullName('');
    setNickname('');
    // setProfilePicture(null);
    // setProfilePicturePreview(null);
  };
  
  const cardBaseClass = "w-full max-w-md bg-white dark:bg-secondary-800 shadow-2xl rounded-xl p-8 md:p-10";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 dark:from-secondary-800 dark:to-secondary-900 p-4">
      <div className="mb-8">
        <AppLogo size="lg" />
      </div>
      <div className={cardBaseClass}>
        <h2 className="text-3xl font-bold text-center text-secondary-800 dark:text-secondary-100 mb-8">
          {isLoginView ? 'Welcome Back!' : 'Create Account'}
        </h2>
        <form onSubmit={handleAuthAction} className="space-y-6">
          {!isLoginView && (
            <>
              <div className="flex flex-col items-center mb-6">
                <Avatar user={{ name: fullName, nickname: nickname, avatarBgColor: avatarBgColor} as User} size="xl" />
                <Button 
                  type="button" 
                  variant="link" 
                  size="sm" 
                  onClick={() => setAvatarBgColor(getRandomColor(AVATAR_COLORS))}
                  className="mt-2 text-xs"
                >
                  Change Avatar Color
                </Button>
              </div>
              <Input
                label="Full Name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required={!isLoginView}
                disabled={isLoading}
              />
              <Input
                label="Nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="johndoe"
                required={!isLoginView}
                disabled={isLoading}
              />
            </>
          )}
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={isLoading}
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={isLoading}
          />
          {/* {!isLoginView && (
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Profile Picture (Optional)</label>
              <input type="file" accept="image/*" onChange={handlePictureChange} className="block w-full text-sm text-secondary-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-secondary-700 dark:file:text-secondary-200 dark:hover:file:bg-secondary-600"/>
              {profilePicturePreview && <img src={profilePicturePreview} alt="Preview" className="mt-2 h-20 w-20 rounded-full object-cover"/>}
            </div>
          )} */}

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
            {isLoginView ? '➡️ Login' : '✅ Create Account'}
          </Button>
        </form>
        <p className="mt-8 text-center text-sm text-secondary-600 dark:text-secondary-400">
          {isLoginView ? "Don't have an account?" : "Already have an account?"}{' '}
          <button onClick={toggleView} className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
            {isLoginView ? 'Sign up now' : 'Log in'}
          </button>
        </p>
      </div>
       <footer className="mt-8 text-center text-sm text-primary-100 dark:text-secondary-500">
        &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthPage;
