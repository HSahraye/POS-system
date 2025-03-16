'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  // Check for remembered user on component mount
  useEffect(() => {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      setFormData(prev => ({
        ...prev,
        email: rememberedUser,
      }));
      setRememberMe(true);
    }
  }, []);

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
    };
    let isValid = true;

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Get users from localStorage
      let users = [];
      try {
        const storedUsers = localStorage.getItem('users');
        users = storedUsers ? JSON.parse(storedUsers) : [];
        
        // Validate that users is an array
        if (!Array.isArray(users)) {
          console.error('Stored users is not an array:', users);
          users = [];
        }
      } catch (error) {
        console.error('Error parsing users from localStorage:', error);
        users = [];
      }
      
      // Find user with matching email and password
      const user = users.find(
        (u: any) => u.email === formData.email && u.password === formData.password
      );
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // Generate a mock token
      const token = `token_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem('token', token);
      
      // Store current user info
      localStorage.setItem('currentUser', JSON.stringify({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }));
      
      // Store user info if remember me is checked
      if (rememberMe) {
        localStorage.setItem('rememberedUser', formData.email);
      } else {
        localStorage.removeItem('rememberedUser');
      }
      
      // Show success message
      toast.success('Login successful!');
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder="Email address"
          error={!!errors.email}
          helperText={errors.email}
          aria-label="Email address"
        />
      </div>

      <div className="relative">
        <Input
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          required
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          error={!!errors.password}
          helperText={errors.password}
          aria-label="Password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? (
            <EyeSlashIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
            Forgot your password?
          </a>
        </div>
      </div>

      <Button
        type="submit"
        variant="default"
        size="lg"
        fullWidth
        isLoading={isLoading}
      >
        Sign in
      </Button>

      <div className="mt-6 text-center text-sm">
        <span className="text-gray-600">Don't have an account?</span>{' '}
        <a href="/signup" className="font-medium text-primary-600 hover:text-primary-500">
          Sign up
        </a>
      </div>
    </form>
  );
} 