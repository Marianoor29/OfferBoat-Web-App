import { FaGoogle, FaApple } from 'react-icons/fa';
import { useEffect, useState } from 'react';

const Login = () => {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMac(/Mac/.test(window.navigator.platform));
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Login</h1>

        {/* Login Form */}
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>

        {/* OR Divider */}
        <div className="flex items-center justify-center space-x-2">
          <hr className="w-1/4 border-gray-300" />
          <span className="text-sm text-gray-500">OR</span>
          <hr className="w-1/4 border-gray-300" />
        </div>

        {/* Social Login */}
        <div className="space-y-4">
          <button
            type="button"
            className="flex items-center justify-center w-full px-4 py-2 space-x-2 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FaGoogle className="text-red-500" />
            <span>Sign in with Google</span>
          </button>
          {isMac && (
            <button
              type="button"
              className="flex items-center justify-center w-full px-4 py-2 space-x-2 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <FaApple className="text-black" />
              <span>Sign in with Apple</span>
            </button>
          )}
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a
              href="/auth/sign-up"
              className="text-blue-500 hover:underline"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
