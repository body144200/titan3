
import React, { ReactNode } from 'react';
import { getInitials } from './utils';
import { User } from './types';

// Icons (Heroicons example, replace with your preferred set or custom SVGs)
export const ChatBubbleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3.68-3.091a9.023 9.023 0 0 1-5.207 0l-3.681 3.091V16.959c-.34-.02-.68-.045-1.02-.072-1.133-.093-1.98-1.057-1.98-2.193V10.608c0-.97.616-1.813 1.5-2.097m14.25-3.866A2.25 2.25 0 0 0 18.75 4.5H5.25A2.25 2.25 0 0 0 3 6.75v8.511c0 .734.405 1.39 1.002 1.753l3.428 2.057a.75.75 0 0 0 .998 0l3.428-2.057a1.875 1.875 0 0 1 1.002-1.753C12.616 15.24 13.29 15 14.025 15h4.725a2.25 2.25 0 0 0 2.25-2.25v-8.511a2.25 2.25 0 0 0-2.25-2.25Z" />
  </svg>
);

export const UsersIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);

export const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

export const CogIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.003 1.11-1.226M12.75 4.5V3m-.223 1.482c.539-.226 1.074-.378 1.626-.44M12 18.75V21m-4.773-1.752A4.5 4.5 0 0 0 7.5 15.25V15h1.575M13.5 15v.25A4.5 4.5 0 0 0 17.25 18h.25a4.5 4.5 0 0 0 .25-8.75V9.75A4.5 4.5 0 0 0 13.5 6H12m2.672.836a4.491 4.491 0 0 1 .696-2.198M16.5 9.75V12m4.5-4.5H21m-3.75 0A4.5 4.5 0 0 1 13.5 9.75V15m0-4.5H12m1.5-.75a4.493 4.493 0 0 0-1.757 2.198M3.75 9.75H3M4.5 7.5A4.5 4.5 0 0 1 8.25 3H9.75M9.75 16.5A4.5 4.5 0 0 1 6 19.75M3.75 12H3m0 3.75A4.5 4.5 0 0 1 7.5 12H9m7.5-3A4.5 4.5 0 0 0 12.75 3M9.75 3.75A4.5 4.5 0 0 0 6 7.5M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
  </svg>
);

export const PaperClipIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.687 7.687a1.5 1.5 0 0 0 2.122 2.122l7.687-7.687-2.121-2.122Z" />
  </svg>
);

export const FaceSmileIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75s.168-.75.375-.75S9.75 9.336 9.75 9.75Zm4.875 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Z" />
  </svg>
);

export const PaperAirplaneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
  </svg>
);

export const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
  </svg>
);

export const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-6.364-.386 1.591-1.591M3 12h2.25m.386-6.364 1.591 1.591M12 12a3.75 3.75 0 1 1 0-7.5 3.75 3.75 0 0 1 0 7.5Z" />
  </svg>
);

export const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
  </svg>
);

export const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg>
);

export const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
);

export const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

export const ThumbsUpIcon: React.FC<{ className?: string }> = ({ className }) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H5.904c-.656 0-1.158.078-1.729.23A2.25 2.25 0 0 0 2.25 12c0 .397.078.79.23 1.158l.078.158c.097.195.223.37.37.516.764.765 1.848 1.207 2.973 1.207h3.584c.618 0 1.214-.24 1.671-.653l1.186-1.187a1.875 1.875 0 0 1 2.652 0l1.88 1.88A1.875 1.875 0 0 1 18.75 16.25v1.628a2.25 2.25 0 0 1-.621 1.477c-.486.486-1.062.855-1.671.998l-3.471.867A4.5 4.5 0 0 1 9.54 21.5H5.904c-2.395 0-4.339-1.943-4.339-4.338V10.182c0-2.395 1.944-4.338 4.34-4.338Z" />
</svg>
);



// Avatar Component
interface AvatarProps {
  user?: Pick<User, 'name' | 'nickname' | 'avatarUrl' | 'avatarBgColor'>;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ user, size = 'md', className = '' }) => {
  if (!user) {
    // Placeholder if user data is not available
    return (
      <div
        className={`rounded-full flex items-center justify-center bg-gray-300 dark:bg-gray-700 text-white ${
          size === 'sm' ? 'w-8 h-8 text-xs' : 
          size === 'md' ? 'w-10 h-10 text-sm' : 
          size === 'lg' ? 'w-12 h-12 text-base' : 
          'w-16 h-16 text-lg' // xl
        } ${className}`}
      >
        ??
      </div>
    );
  }

  const initials = getInitials(user.name || user.nickname || 'User');
  const bgColor = user.avatarBgColor || 'bg-gray-500';

  const sizeClasses = 
    size === 'sm' ? 'w-8 h-8 text-xs' : 
    size === 'md' ? 'w-10 h-10 text-sm' : 
    size === 'lg' ? 'w-12 h-12 text-base' : 
    'w-16 h-16 text-lg'; // xl

  return (
    <div
      className={`rounded-full flex items-center justify-center overflow-hidden shrink-0 ${sizeClasses} ${className}`}
    >
      {user.avatarUrl ? (
        <img src={user.avatarUrl} alt={user.name || 'Avatar'} className="w-full h-full object-cover" />
      ) : (
        <div className={`w-full h-full flex items-center justify-center ${bgColor} text-white font-semibold`}>
          {initials}
        </div>
      )}
    </div>
  );
};

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  const baseStyles = "font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-secondary-800 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";
  
  const variantStyles = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
    secondary: 'bg-secondary-200 hover:bg-secondary-300 text-secondary-800 dark:bg-secondary-700 dark:hover:bg-secondary-600 dark:text-secondary-100 focus:ring-secondary-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    ghost: 'bg-transparent hover:bg-secondary-100 dark:hover:bg-secondary-700 text-primary-600 dark:text-primary-400 focus:ring-primary-500',
    link: 'bg-transparent text-primary-600 dark:text-primary-400 hover:underline p-0 focus:ring-primary-500',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {leftIcon && !isLoading && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && !isLoading && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
}

export const Input: React.FC<InputProps> = ({ label, id, error, className = '', wrapperClassName = '', ...props }) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className={`mb-4 ${wrapperClassName}`}>
      {label && <label htmlFor={inputId} className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">{label}</label>}
      <input
        id={inputId}
        className={`block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

// Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  footer?: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md', footer }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full h-full',
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className={`bg-white dark:bg-secondary-800 rounded-lg shadow-xl overflow-hidden w-full ${sizeClasses[size]} transform transition-all animate-slideInUp`}
        onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
      >
        {title && (
          <div className="px-6 py-4 border-b border-secondary-200 dark:border-secondary-700">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">{title}</h3>
          </div>
        )}
        <div className={`p-6 ${size === 'full' ? 'overflow-y-auto h-[calc(100%-120px)]' : 'max-h-[70vh] overflow-y-auto'}`}>
          {children}
        </div>
        {footer && (
          <div className="px-6 py-4 border-t border-secondary-200 dark:border-secondary-700 flex justify-end space-x-3">
            {footer}
          </div>
        )}
         {!title && ( // Add a close button if no title (where a close button might typically be)
            <button 
                onClick={onClose} 
                className="absolute top-3 right-3 text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200"
                aria-label="Close modal"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        )}
      </div>
    </div>
  );
};

// LoadingSpinner Component
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg', className?: string }> = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-4',
  };
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div 
        className={`animate-spin rounded-full ${sizeClasses[size]} border-primary-500 border-t-transparent`}
      />
    </div>
  );
};

// Logo Component
export const AppLogo: React.FC<{ size?: 'sm' | 'md' | 'lg', className?: string }> = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'h-8 w-auto',
    md: 'h-10 w-auto',
    lg: 'h-12 w-auto',
  };
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <svg className={`${sizeClasses[size]} text-primary-600 dark:text-primary-500`} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 16.5V13.75H8V11.25H11V7.5L16 12L11 16.5Z"/>
      </svg>
      <span className={`font-bold ${size === 'sm' ? 'text-xl': size === 'md' ? 'text-2xl' : 'text-3xl'} text-secondary-800 dark:text-secondary-100`}>TitanChat</span>
    </div>
  );
};
