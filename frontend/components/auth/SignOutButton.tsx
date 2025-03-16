'use client';

import { useRouter } from 'next/navigation';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

interface SignOutButtonProps {
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

export default function SignOutButton({ 
  className = "group -mx-2 flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-primary-600", 
  showIcon = true,
  children
}: SignOutButtonProps) {
  const router = useRouter();

  const handleSignOut = () => {
    // Only remove the authentication token
    if (typeof window !== 'undefined') {
      // Store the current user data in persistent storage before signing out
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        localStorage.setItem('persistentUserData', currentUser);
      }
      
      // Remove only authentication-related data
      localStorage.removeItem('token');
      
      // Use window.location for a full page refresh to ensure clean state
      window.location.href = '/login';
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className={className}
    >
      {showIcon && (
        <ArrowRightOnRectangleIcon
          className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-primary-600"
          aria-hidden="true"
        />
      )}
      {children || "Sign out"}
    </button>
  );
} 