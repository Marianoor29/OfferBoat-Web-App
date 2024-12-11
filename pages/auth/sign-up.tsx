import { FaGoogle, FaApple } from 'react-icons/fa';
import { useContext, useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import axios from 'axios';
import { useRouter } from 'next/router';
import { setCookie } from 'nookies';
import { UserContext } from '@/context/UserContext';

const SignUp = () => {
  const router = useRouter();
  const [isMac, setIsMac] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const { setUser } = useContext(UserContext)!;
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMac(/Mac/.test(window.navigator.platform));
    }
  }, []);

  // Validation function to check all fields and password match
  useEffect(() => {
    if (
      firstName &&
      lastName &&
      email &&
      password &&
      confirmPassword &&
      password === confirmPassword
    ) {
      setIsButtonDisabled(false);
      setPasswordMatchError('');
    } else {
      setIsButtonDisabled(true);
      if (password && confirmPassword && password !== confirmPassword) {
        setPasswordMatchError('Passwords do not match');
      } else {
        setPasswordMatchError('');
      }
    }
  }, [firstName, lastName, email, password, confirmPassword]);

  const handleEmailSignUp = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const response = await axios.post(`https://www.offerboats.com/verify`, {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
      });
      setCookie(null, 'userData', JSON.stringify(
        response.data.userdata
      ), {
        maxAge: 60 * 60,
        path: '/',
      });
      router.push('/auth/email-verification');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'An error occurred';
      setErrorMessage(errorMessage);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      // Retrieve the user's credential
      const firebaseUser = result.user;
      const firebaseIdToken = await firebaseUser.getIdToken();
      // Send the credential to the backend
      const response = await axios.post('https://www.offerboats.com/google', {
        token: firebaseIdToken,
      });

      const { isNewUser, firstName, lastName, email, profilePicture, token, userType } = response.data;
      if (isNewUser) {
        setCookie(null, 'userData', JSON.stringify({
          firstName,
          lastName,
          email,
          profilePicture,
          type: 'googleSignup',
        }), {
          maxAge: 60 * 60,
          path: '/',
        });
        router.push('/auth/choose-user-type');
      } else {
        setUser({ token, userType });
        window.location.href = "/";
      }
    } catch (error: any) {
      console.error('Error during Google Sign-In:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('The popup was closed by the user before completing the authentication.');
      } else {
        console.error('Other error:', error);
      }
      setErrorMessage(error.response?.data?.error || error.message || 'An error occurred during Google Sign-In');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-8 space-y-6 my-5 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">Register your account</h1>
        {/* Sign Up Form */}
        <form className="space-y-4" onSubmit={handleEmailSignUp}>
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Password mismatch error */}
          {passwordMatchError && (
            <p className="text-red-500 text-sm">{passwordMatchError}</p>
          )}

          <button
            type="submit"
            disabled={isButtonDisabled}
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign Up
          </button>
        </form>

        {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
        {/* OR Divider */}
        <div className="flex items-center justify-center space-x-2">
          <hr className="w-1/4 border-gray-300" />
          <span className="text-sm text-gray-500">OR</span>
          <hr className="w-1/4 border-gray-300" />
        </div>

        {/* Social Signup */}
        <div className="space-y-4">
          <button
            type="button"
            className="flex items-center justify-center w-full px-4 py-2 space-x-2 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleGoogleLogin}
          >
            <FaGoogle className="text-red-500" />
            <span>Sign up with Google</span>
          </button>
          {/* {isMac && (
            <button
              type="button"
              className="flex items-center justify-center w-full px-4 py-2 space-x-2 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <FaApple className="text-black" />
              <span>Sign up with Apple</span>
            </button>
          )} */}
        </div>

        {/* Already Have Account */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a
              href="/auth/login"
              className="text-blue-500 hover:underline"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
