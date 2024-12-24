'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';
import axios from 'axios';

const EmailVerification = () => {
  const router = useRouter();
  const [userdata, setUserData] = useState<any>(null);
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [resendMessage, setResendMessage] = useState<string>('');
  const { userData } = parseCookies();

   useEffect(() => {
    if (userData) {
      const parsedData = JSON.parse(userData);
      setUserData(parsedData);
      setVerificationCode(parsedData?.VerificationCode); 
    } else {
      router.push('/auth/sign-up'); 
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code === verificationCode.toString()) {
      router.push('/auth/choose-user-type')
    } else {
      setErrorMessage('Incorrect verification code');
      setTimeout(() => {
        setErrorMessage('');
      }, 2000);
    }
  };

  const resendCode = async () => {
    try {
      const response = await axios.post('https://www.offerboats.com/resendCode', { email: userdata?.email });
      setVerificationCode(response.data.verificationCode);  
      setResendMessage('Verification code resent successfully.');
    } catch (error) {
      setResendMessage('Failed to resend verification code. Please try again.');
    }
  };

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Verify Email</h1>
      <p className="text-sm text-gray-600 mb-4">
        Enter the 6-digit code sent to your email.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">
            Verification Code
          </label>
          <input
            type="text"
            id="verificationCode"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter 6-digit code"
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
          {resendMessage && <p className="text-green-500 text-sm mt-1">{resendMessage}</p>}
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={code.length !== 6} 
        >
          Verify
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={resendCode}
          className="text-blue-500 text-sm hover:underline"
        >
          Resend Code
        </button>
      </div>

      <div className="mt-8 text-sm text-gray-600">
        <p className="mb-8">
          Thank you for registering with us! To complete your registration, please verify your email address.
        </p>
        <p>
          <strong className="text-red-600">Please Note:</strong> Sometimes, our verification emails may end up in your spam or junk folder. If you do not see the email in your inbox, kindly check these folders. If you still cannot find the verification email, you may request a new one.
        </p>
        <p className="mt-2">Thank you for your patience.</p>
      </div>
      </div>
    </div>
  );
};

export default EmailVerification;
