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
    // Remove the authentication token from localStorage
    if (typeof window !== 'undefined') {
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