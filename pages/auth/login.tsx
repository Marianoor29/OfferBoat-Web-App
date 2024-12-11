import { auth } from '@/firebaseConfig';
import axios from 'axios';
import { GoogleAuthProvider, OAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/router';
import { setCookie } from 'nookies';
import { useEffect, useState } from 'react';
import { FaApple, FaGoogle } from 'react-icons/fa';
import { useContext } from "react";
import { UserContext } from '@/context/UserContext';

const Login = () => {
  const router = useRouter();
  const [isMac, setIsMac] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { setUser } = useContext(UserContext)!;
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMac(/Mac/.test(window.navigator.platform));
    }
  }, []);

  const handleEmailLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://www.offerboats.com/signin', { email, password });
      const { token, userType } = response.data;
      setUser({ token, userType });
      window.location.href = "/";
      // router.push('/index')
    } catch (error: any) {
      setErrorMessage(error.response?.data?.error || 'An error occurred');
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
         router.push('/auth/choose-user-type')
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

  // const handleAppleLogin = async () => {
  //   const provider = new OAuthProvider('apple.com');
  //   console.log(provider, 'provider')
  //   // Configure the provider's additional parameters if necessary
  //   provider.addScope('email');
  //   provider.addScope('name');

  //   try {
  //     const result = await signInWithPopup(auth, provider);
  //     // Extract the credential and user information
  //   const credential = OAuthProvider.credentialFromResult(result);
  //   if (!credential) {
  //     throw new Error('No credential returned from Apple Sign-In');
  //   }
  //   const firebaseUser = result.user;
  //   const firebaseIdToken = await firebaseUser.getIdToken();

  //   console.log('Firebase Token:', firebaseIdToken);
  // // User details
  // const email = result.user.email || '';
  // const name = result.user.displayName || '';

  //     // Send the Firebase ID token to your backend for processing
  //     const backendResponse = await axios.post('https://www.offerboats.com/apple', {
  //       token: firebaseIdToken,
  //       email,
  //       name,
  
  //     });
  //     console.log('Backend Response:', backendResponse.data);

  //     const { isNewUser, firstName, lastName, email: responseEmail, profilePicture, token, userType } = backendResponse.data;

  //     if (isNewUser) {
  //       window.location.href = `/choose-user-type?firstName=${firstName}&lastName=${lastName}&email=${responseEmail}&profilePicture=${profilePicture}`;
  //     } else {
  //       localStorage.setItem('userInfo', JSON.stringify({ token, userType }));
  //       window.location.href = '/';
  //     }
  //   } catch (error: any) {
  //     console.error('Error during Apple Sign-In:', error);
  //     if (error.code === 'auth/popup-closed-by-user') {
  //       console.log('The popup was closed by the user before completing the authentication.');
  //     }
  //     setErrorMessage(error.response?.data?.error || error.message || 'An error occurred during Apple Sign-In');
  //   }
  // };

  useEffect(() => {
    console.log("Auth after redirect:", auth.currentUser);
  }, []);


  return (
    <div className="flex items-center justify-center min-h-screen g-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">Login to your account</h1>
        {/* Login Form */}
        <form className="space-y-4" onSubmit={handleEmailLogin}>
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
              autoComplete="email"
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
              autoComplete="current-password"
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

        {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

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
            className="flex items-center justify-center w-full px-4 py-2 space-x-2 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
            onClick={handleGoogleLogin}
          >
            <FaGoogle className="text-black" />
            <span>Sign in with Google</span>
          </button>

          {/* {isMac && (
            <button
              type="button"
              className="flex items-center justify-center w-full px-4 py-2 space-x-2 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={handleAppleLogin}
            >
              <FaApple className="text-black" />
              <span>Sign in with Apple</span>
            </button>
          )} */}
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
