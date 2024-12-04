import axios from 'axios';
import { GoogleAuthProvider, getAuth, getRedirectResult, signInWithPopup, signInWithRedirect ,signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { FaApple, FaGoogle } from 'react-icons/fa';
import {app, auth} from '@/firebaseConfig' 

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
      // window.location.href = userType === 'BoatRenter' ? '/renter/dashboard' : '/owner/dashboard';
    } catch (error:any) {
      setErrorMessage(error.response?.data?.error || 'An error occurred');
    }
  };

  // const handleGoogleLogin = async () => {
  //   const provider = new GoogleAuthProvider();
  //   try {
  //     const result = await signInWithPopup(auth, provider);
  //     const user = result.user;
  //     console.log("Logged in user:", user);

  //     // Example: Get the ID token
  //     const idToken = await user.getIdToken();
  //     console.log("ID Token:", idToken);

  //     // Pass the token to your backend for further processing
  //   } catch (error) {
  //     console.error("Error during Google Sign-In:", error);
  //   }
  // };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      if (auth.currentUser) {
        console.log("User already signed in:", auth.currentUser);
       alert('current user active')
      } else {
        await signInWithRedirect(auth, provider);
      }
    } catch (error) {
      console.error("Error during Google Sign-In redirect:", error);
    }
  };

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log("User signed in:", result.user);
          const idToken = await result.user.getIdToken();
          console.log("ID Token:", idToken);
          localStorage.setItem('userInfo', JSON.stringify({ token: idToken, }));
        } else {
          console.log("No redirect result found.");
        }
      } catch (error) {
        console.error("Error during redirect result processing:", error);
      }
    };
  
    handleRedirect();
  }, []);
  
  useEffect(() => {
    console.log("Auth currentUser:", auth.currentUser);
  }, []);


  // useEffect(() => {
  //   const fetchRedirectResult = async () => {
  //     try {
  
  //      await getRedirectResult(auth)
       
  //       .then((result:any) => {
  //          // This gives you a Google Access Token. You can use it to access Google APIs.
  //   // const credential = GoogleAuthProvider.credentialFromResult(result);
  //   // const token = credential.accessToken;
  //         console.log('Firebase Token:', result);
  //       }).catch((error) => {
  //         console.log('Firebase error:', error);
  //       });

  //       //   // Send token to your backend
  //       //   const response = await axios.post('https://www.offerboats.com/google', {
  //       //     token: firebaseIdToken,
  //       //   });
  
  //       //   console.log("Backend Response:", response.data);
  //       //   const { isNewUser, firstName, lastName, email, profilePicture, token, userType } = response.data;
  
  //       //   if (isNewUser) {
  //       //     alert('New user successfully signed up');
  //       //     window.location.href = `/choose-user-type?firstName=${firstName}&lastName=${lastName}&email=${email}&profilePicture=${profilePicture}`;
  //       //   } else {
  //       //     localStorage.setItem('userInfo', JSON.stringify({ token, userType }));
  //       //     alert('Login successful');
  //       //     window.location.href = "/";
  //       //   }
  //       // }
  //     } catch (error) {
  //       console.error("Error during Google Sign-In:", error);
  //       // Handle errors gracefully
  //     }
  //   };
  
  //   fetchRedirectResult();
  // }, []);
  


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
              autoComplete='email'
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
              autoComplete='current-password'
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
