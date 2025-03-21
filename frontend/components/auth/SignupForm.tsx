'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const validateForm = () => {
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    };
    let isValid = true;

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }

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
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      // Check if user already exists in localStorage
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
      
      const userExists = users.some((user: any) => user.email === formData.email);
      
      if (userExists) {
        throw new Error('User with this email already exists');
      }
      
      // Add new user to localStorage
      const newUser = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Generate a mock token
      const token = `token_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem('token', token);
      
      // Store current user info
      localStorage.setItem('currentUser', JSON.stringify({
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email
      }));
      
      toast.success('Registration successful!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed');
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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First name"
            error={!!errors.firstName}
            helperText={errors.firstName}
            aria-label="First name"
          />
        </div>
        <div>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last name"
            error={!!errors.lastName}
            helperText={errors.lastName}
            aria-label="Last name"
          />
        </div>
      </div>

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
          autoComplete="new-password"
          required
          value={formData.password}
          onChange={handleChange}
          placeholder="Create password"
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

      <Button
        type="submit"
        variant="default"
        size="lg"
        fullWidth
        isLoading={isLoading}
      >
        Create account
      </Button>

      <div className="mt-6 text-center text-sm">
        <span className="text-gray-600">Already have an account?</span>{' '}
        <a href="/login" className="font-medium text-primary-600 hover:text-primary-500">
          Sign in
        </a>
      </div>
    </form>
  );
} 