import SignupForm from '@/components/auth/SignupForm';
import Image from 'next/image';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="flex min-h-screen">
        {/* Left side - Signup Form */}
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
                Create an account
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Sign up to get started with our POS system
              </p>
            </div>

            <div className="mt-8">
              <SignupForm />
            </div>
          </div>
        </div>

        {/* Right side - Hero Image */}
        <div className="relative hidden w-0 flex-1 lg:block">
          <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-primary-600 to-primary-800">
            <div className="absolute inset-0 bg-opacity-75 backdrop-blur-sm">
              <div className="flex h-full items-center justify-center">
                <div className="max-w-2xl px-8 text-center text-white">
                  <h1 className="text-4xl font-bold sm:text-5xl">
                    Join Our POS Community
                  </h1>
                  <p className="mt-6 text-xl">
                    Get started with our modern point of sale system.
                    Manage your business efficiently and grow with confidence.
                  </p>
                  <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {[
                      { title: 'Setup Time', value: '5 min' },
                      { title: 'Free Trial', value: '14 days' },
                      { title: 'Support', value: '24/7' },
                    ].map((stat) => (
                      <div key={stat.title} className="px-4 py-6">
                        <p className="text-3xl font-semibold">{stat.value}</p>
                        <p className="mt-2 text-sm">{stat.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 