import { FaGoogle, FaApple } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '@/firebaseConfig';

const Login = () => {
  const [isMac, setIsMac] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
      localStorage.setItem('userInfo', JSON.stringify({ token, userType }));
      window.location.href ='/';
      alert('login successfull')
      // window.location.href = userType === 'BoatRenter' ? '/renter/dashboard' : '/owner/dashboard';
    } catch (error:any) {
      setErrorMessage(error.response?.data?.error || 'An error occurred');
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    try {
      const { credential } = credentialResponse;
      if (!credential) throw new Error("No credential received");

      const googleCredential = GoogleAuthProvider.credential(credential);
      console.log(googleCredential, 'googleCredential')
    const userCredential = await signInWithCredential(auth, googleCredential);
    console.log(userCredential, 'userCredential')
    const firebaseIdToken = await userCredential.user.getIdToken();
    console.log(firebaseIdToken, 'firebaseIdToken')

      // Send the credential to the backend
      const response = await axios.post('https://www.offerboats.com/google', {
          token: firebaseIdToken,
      });
      console.log("Backend Response:", response.data);

      const { isNewUser, firstName, lastName, email, profilePicture, token, userType } = response.data;

      if (isNewUser) {
        alert('new user successfull')
        window.location.href = `/choose-user-type?firstName=${firstName}&lastName=${lastName}&email=${email}&profilePicture=${profilePicture}`;
      } else {
        localStorage.setItem('userInfo', JSON.stringify({ token, userType }));
        alert('login successfull')
        window.location.href = "/";
      }
    } catch (error:any) {
      setErrorMessage(error.response?.data?.error || 'An error occurred during Google Sign-In');
    }
  };

  const handleGoogleLoginError = () => {
    setErrorMessage('An error occurred during Google Sign-In');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Login</h1>
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
       <div  className="flex items-center justify-center w-full px-4 py-2 space-x-2 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500">
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginError}
          
        />
        </div>
     
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
