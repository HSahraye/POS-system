import LoginForm from '@/components/auth/LoginForm';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="flex min-h-screen">
        {/* Left side - Login Form */}
        <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="flex flex-col items-center">
              <Image
                src="/logo.svg"
                alt="POS System Logo"
                width={64}
                height={64}
                className="rounded-lg shadow-lg"
                priority
              />
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Sign in to your account
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Or{' '}
                <Link
                  href="/signup"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  create a new account
                </Link>
              </p>
            </div>

            <div className="mt-8">
              <LoginForm />
            </div>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="relative hidden w-0 flex-1 lg:block">
          <div className="absolute inset-0 h-full w-full object-cover">
            <div className="flex h-full items-center justify-center bg-gradient-to-tr from-primary-600 to-primary-800 p-12">
              <div className="max-w-2xl text-center text-white">
                <h2 className="text-4xl font-bold">
                  Streamline Your Business Operations
                </h2>
                <p className="mt-4 text-xl">
                  Our POS system helps you manage inventory, process sales, and
                  track customer data all in one place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 